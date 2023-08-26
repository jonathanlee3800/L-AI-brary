// API KEY ONBOARDING ||
// catch lack of API Key
const keyGet = await chrome.storage.sync.get(["OPENAI_API_KEY"]);

const OPENAI_API_KEY = keyGet.OPENAI_API_KEY;

OPENAI_API_KEY ?? chrome.runtime.openOptionsPage();

// OPENAI API ENDPOINTS ||

const URL = "https://api.openai.com/v1/chat/completions";
const SMU_URL = "https://search.library.smu.edu.sg/discovery/search?";
const loadButton = document.getElementById("load");
loadButton.style.display = "none";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

function formatRequestData(
  prompt,
  model = "gpt-3.5-turbo",
  req_headers = HEADERS,
  temperature = 0.6
) {
  // Function to generate request data
  return {
    method: "POST",
    headers: req_headers,
    body: JSON.stringify({
      model: model,
      messages: [{ role: "system", content: prompt }],
      temperature: temperature,
    }),
  };
}

function formatFunctionRequestData(
  functions,
  prompt,
  model = "gpt-3.5-turbo",
  req_headers = HEADERS,
  temperature = 0.6
) {
  // Function to generate request data
  return {
    method: "POST",
    headers: req_headers,
    body: JSON.stringify({
      model: model,
      messages: [{ role: "system", content: prompt }],
      temperature: temperature,
      functions: functions,
    }),
  };
}

// CREATE QUERY FUNCTIONS ||

async function generateQuery(query, promptFn) {
  // Returns promise object for json response data

  // formats query into template prompt
  const prompt = promptFn(query);

  // Uses formatRequestData to generate request Data
  const requestData = formatRequestData(prompt);

  let response = await fetch(URL, requestData);

  // Promise object which resolves to Javascript Object (converted from JSON response)
  return response.json();
}

async function functionQuery(prompt, functions) {
  const reqdata = formatFunctionRequestData(functions, prompt);
  let response = await fetch(URL, reqdata);
  return response.json();
}

function getContentFromRes(data) {
  // Returns text content from generateQuery response object
  return data.choices[0].message.content;
}

// REFINE QUERY FUNCTIONS ||

// SEARCH FUNCTIONS ||

// function takes endpoint url and query object with param key-val pairs and returns full url

function formatUrl(url, paramObj) {
  // use URLSearchParams.toString() method
  let params = new URLSearchParams({
    query: `any,contains,${paramObj.query}`,
    tab: paramObj.tab ?? "Everything",
    search_scope: paramObj.tab ?? "Everything",
    vid: "65SMU_INST:SMU_NUI",
    offset: 0,
    // searchInFullText: true,
  });

  let paramString = params.toString();

  let resURL = url + paramString;

  // Replace default '+' with SMU's variables
  // console.log(resURL.replaceAll(/\+/g, "%20").replaceAll(/%2C/g, ","));

  return resURL;
}

function search() {
  const searchInput = document.getElementById("basic-url");
  const submitButton = document.getElementById("submit");
  const loadButton = document.getElementById("load");
  submitButton.style.display = "none";
  loadButton.style.display = "block";

  var search = document.getElementById("basic-url").value;
  generateQuery(search, altPrompt).then((data) => {
    console.log(data.choices[0].message.content);
    const datares = data.choices[0].message.content.split(" ");
    console.log(datares);
    var query = "";
    const lastItem = datares[datares.length - 1];
    datares.forEach((element) => {
      if (element == lastItem) {
        console.log(element, "last");
        query = query + element;
      } else {
        console.log(element, lastItem, "not last");
        query = query + element + "%20";
      }
    });
    submitButton.style.display = "block";
    loadButton.style.display = "none";
    console.log(query);
    // window.location.replace(
    // );
    chrome.tabs.update({
      url: `https://search.library.smu.edu.sg/discovery/search?query=any,contains,${query}&tab=Everything&search_scope=Everything&vid=65SMU_INST:SMU_NUI&offset=0`,
    });
  });
}

const searchbutton = document.getElementById("submit");
searchbutton.addEventListener("click", search);

functionQuery(
  "electrics cars info from the last 5 years and only show me magazines only",
  refineTextObj
).then(
  (data) => {
    console.log(data);
  },
  (reason) => {
    console.error(reason); // Error!
  }
);
