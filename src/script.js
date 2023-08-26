// API KEY ONBOARDING ||
// catch lack of API Key
const keyGet = await chrome.storage.sync.get(["OPENAI_API_KEY"]);

const OPENAI_API_KEY = keyGet.OPENAI_API_KEY;

OPENAI_API_KEY ?? chrome.runtime.openOptionsPage();

const FACETS = ["rtype"]

// OPENAI API ENDPOINTS ||

const URL = "https://api.openai.com/v1/chat/completions";
const SMU_URL = "https://search.library.smu.edu.sg/discovery/search?";

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
  model = "gpt-3.5-turbo",
  req_headers = HEADERS,
  temperature = 0.8
) {
  // Function to generate request data
  let body = {
      model: model,
      messages: [
          { role: "system", content: "write the user a library search query based on user's input, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible. Expand common abbreviations."},
          { role: "user", content: "Poverty in Asia" },
          { role: "assistant", content: "Poverty in Asia AND Asian Poverty"},
          { role: "user", content: "electric cars in Singapore"},
          { role: "assistant", content: '("Electric Cars" OR "Electric Vehicles") AND Singapore'},
          { role: "user", content: prompt}
          ],
      temperature: temperature,
    };

  // if functions array provided, include in object
  if (functions) {body.functions = functions};
    
  let reqData = {
    method: "POST",
    headers: req_headers,
    body: JSON.stringify(body)
};

  console.log(reqData)
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

async function getMessageFromRes(data) {
  // Returns text content from generateQuery response object
  let resData = await data;
  return data.choices[0].message
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
  })
  
  if (paramObj.hasOwnProperty("searchcreationdate")){
    params.append("facet", `searchcreationdate,include,${paramObj.searchcreationdate[0]}|,|${paramObj.searchcreationdate[1]}`);
  }

  // if key in facets
  console.log(paramObj);

  let includedFacets = Object.keys(paramObj).filter(item => FACETS.includes(item));

  console.log(includedFacets);

  // For every included facet
  includedFacets.forEach(key => {
    // for every item in array
    paramObj[key].forEach(item => {
      params.append("mfacet", `${key},include,${item},1`)
    })
  })

  let paramString = params.toString();

  let resURL = url + paramString;

  // Replace default '+' with SMU's variables
  // console.log(resURL.replaceAll(/\+/g, "%20").replaceAll(/%2C/g, ","));

  return resURL;
}

async function responseToParamObj(resPromise){
    // get message from response promise
    let message = await getMessageFromRes(resPromise);
    console.log(message)

    // get function call and parse to JS Object
    let args = JSON.parse(message.function_call.arguments);

    // get facets
    console.log(args);
    return args;
}

function search() {
  console.log("check session:", chrome.storage.sync.get("selectionText"));
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
    console.log(query);
    // window.location.replace(
    // );
    chrome.tabs.update({
      url: `https://search.library.smu.edu.sg/discovery/search?query=any,contains,${query}&tab=Everything&search_scope=Everything&vid=65SMU_INST:SMU_NUI&offset=0`,
    });
  });
}

async function searchWithFacets(functions, prompt, promptFn){
  // var prompt = document.getElementById("basic-url").value;
  
  // response from GPT
  let res = await generateFunctionQuery(promptFn(prompt), functions);
  let paramObj = await responseToParamObj(res);

  chrome.tabs.update({
    url: formatUrl(SMU_URL, paramObj)
  }); 

}

const searchbutton = document.getElementById("submit");
searchbutton.addEventListener("click", () => {
  searchWithFacets([refineTextObj2], document.getElementById("basic-url").value, altPrompt)
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

