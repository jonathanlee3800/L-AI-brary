// API KEY ONBOARDING ||
// catch lack of API Key
const keyGet = await chrome.storage.sync.get(["OPENAI_API_KEY"]);

const OPENAI_API_KEY = keyGet.OPENAI_API_KEY;

OPENAI_API_KEY ?? chrome.runtime.openOptionsPage();

const FACETS = ["rtype"];

// OPENAI API ENDPOINTS ||

const URL = "https://api.openai.com/v1/chat/completions";
const SMU_URL = "https://search.library.smu.edu.sg/discovery/search?";
const loadButton = document.getElementById("load");
loadButton.style.display = "none";
//chatlog
var chathistory = [];
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

function formatRequestData(
  prompt,
  functions = null,
  model = "gpt-4",
  req_headers = HEADERS,
  temperature = 0.2
) {
  // Function to generate request data
  let body = {
    model: model,
    messages: [{ role: "user", content: prompt }],
    temperature: temperature,
  };

  // if functions array provided, include in object
  if (functions) {
    body.functions = functions;
  }

  let reqData = {
    method: "POST",
    headers: req_headers,
    body: JSON.stringify(body),
  };

  console.log(reqData);
  return reqData;
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

async function generateFunctionQuery(prompt, functions) {
  const reqdata = formatRequestData(prompt, functions);
  let response = await fetch(URL, reqdata);
  return response.json();
}

async function getContentFromRes(data) {
  // Returns text content from generateQuery response object
  let resData = await data;
  return data.choices[0].message.content;
}

function getMessageFromRes(data) {
  // Returns text content from generateQuery response object
  let resData = data;
  return data.choices[0].message;
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

  if (paramObj.hasOwnProperty("searchcreationdate")) {
    params.append(
      "facet",
      `searchcreationdate,include,${paramObj.searchcreationdate[0]}|,|${paramObj.searchcreationdate[1]}`
    );
  }

  // if key in facets
  console.log(paramObj);

  let includedFacets = Object.keys(paramObj).filter((item) =>
    FACETS.includes(item)
  );

  console.log(includedFacets);

  // For every included facet
  includedFacets.forEach((key) => {
    // for every item in array
    paramObj[key].forEach((item) => {
      params.append("mfacet", `${key},include,${item},1`);
    });
  });

  let paramString = params.toString();

  let resURL = url + paramString;

  // Replace default '+' with SMU's variables
  // console.log(resURL.replaceAll(/\+/g, "%20").replaceAll(/%2C/g, ","));

  return resURL;
}

//show chathistory
function showChatHistory(chathistory) {
  const chatHistoryDiv = document.getElementById("chathistory");
  chatHistoryDiv.innerHTML = "";
  chathistory.forEach((data) => {
    const messageContainer = document.createElement("div");
    if (data.role == "user") {
      chatHistoryDiv.appendChild(
        document.createTextNode("You : " + data.message)
      );
    } else {
      const systemMessage = document.createElement("div");
      const systemImage = document.createElement("img");
      systemImage.src = "/assets/mascot.png";
      systemImage.alt = "System Icon";
      systemImage.style.height = "25px";

      systemMessage.appendChild(systemImage);
      systemMessage.appendChild(document.createTextNode(" : " + data.message));
      messageContainer.appendChild(systemMessage);
      messageContainer.appendChild(document.createElement("br"));
    }
    chatHistoryDiv.appendChild(messageContainer);
  });
}

function responseToParamObj(resData, isFunctionCall = false) {
  // get message from response promise

  let message = getMessageFromRes(resData);
  console.log(message);

  // get function call and parse to JS Object

  let paramObj = {};
  if (isFunctionCall) {
    if (message.function_call) {
      paramObj = JSON.parse(message.function_call.arguments);
    }
  } else {
    paramObj = { query: message.content };
  }

  // get facets
  return paramObj;
}

async function searchWithFacets(functions, prompt, promptFn) {
  // var prompt = document.getElementById("basic-url").value;
  const submitButton = document.getElementById("submit");
  const loadButton = document.getElementById("load");
  submitButton.style.display = "none";
  loadButton.style.display = "block";
  var search = document.getElementById("basic-url").value;
  chathistory.push({
    role: "user",
    message: search,
  });
  // response from GPT
  let query = await generateQuery(prompt, promptFn);
  let paramObj = responseToParamObj(query);

  // response from GPT with function calling
  let funcRes = await generateFunctionQuery(prompt, functions);
  console.log("funcRes");
  console.log(funcRes);
  let functionParamObj = responseToParamObj(funcRes, true);

  Object.assign(paramObj, functionParamObj);

  chrome.tabs.update({
    url: formatUrl(SMU_URL, paramObj),
  });

  submitButton.style.display = "block";
  loadButton.style.display = "none";
  chathistory.push({
    role: "system",
    message: "test message from system",
  });
  console.log(chathistory, "CHATHISTORY");
  showChatHistory(chathistory);
}

const searchbutton = document.getElementById("submit");
searchbutton.addEventListener("click", () => {
  searchWithFacets(
    [refineTextObj],
    document.getElementById("basic-url").value,
    altPrompt
  );
});

// generateFunctionQuery(
//   "search for cars and include book chapters from 2020 to 2022",
//   [refineTextObj]
// ).then(
//   (data) => {
//     console.log(data);
//     console.log(formatUrl(SMU_URL, JSON.parse(data.choices[0].message.function_call.arguments)));
//   },
//   (reason) => {
//     console.error(reason); // Error!
//   }
// );

// functionQuery(
//   "electrics cars info from the last 5 years and only show me magazines only",
//   refineTextObj
// ).then(
//   (data) => {
//     console.log(JSON.parse(data.choices[0].message.function_call.arguments));
//   },
//   (reason) => {
//     console.error(reason); // Error!
//   }
// );
