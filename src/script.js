// API KEY ONBOARDING ||
// catch lack of API Key
const keyGet = await chrome.storage.sync.get(["OPENAI_API_KEY"]);
const OPENAI_API_KEY = keyGet.OPENAI_API_KEY;

OPENAI_API_KEY ?? chrome.runtime.openOptionsPage();


// OPENAI API ENDPOINTS ||

const URL = "https://api.openai.com/v1/chat/completions";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};


// PROMPTS ||

const firstPrompt = query =>
    `find the main keywords for my prompt. Keep important keywords in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 1 keywords
      User: i want to seach for more information and articles about Poverty in Asia 
      ChatGPT: Poverty in Asia
  
      User: ${query}
      ChatGPT: `;

const altPrompt = query => 
    `write me a library search query, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible.

    User: Poverty in Asia
    ChatGPT: Poverty in Asia AND Asian Poverty
    
    User: Electric Cars in Singapore
    ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore
    
    User: ${query}
    ChatGPT:`;

const refinePrompt = (query, refine) => 
    `refine the given search query based on the user's instructions. Use appropriate boolean operators, parantheses grouping, and wildcards.

    Query: Poverty in Asia AND Asian Poverty
    User: I want to see more relating to Southeast Asia
    ChatGPT: Poverty in Asia AND Asian Poverty AND (Southeast Asia OR ASEAN)
    
    Query: ("presidential elections" OR "presidential polls" OR "presidential campaigns") AND Singapore
    User: I want to see less results on Indonesia
    ChatGPT: ("presidential elections" OR "presidential polls" OR "presidential campaigns") AND Singapore NOT Indonesia
    
    Query: Electric Cars in Singapore
    User: I want to see more results about buses specifically
    ChatGPT:  ("Electric Cars" OR "Electric Vehicles") AND Singapore AND bus*
    
    Query: ${query}
    User: ${refine}
    ChatGPT:`;


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

// async function generateInitialQuery(query) {
//   // Returns promise object for json response data

//   const prompt = `generate keywords for my prompt. suggest keywords that may relate to the search query, keep important queries in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 10 keywords
//     User: Poverty in Asia
//     ChatGPT: "Poverty in Asia" OR "Asian poverty rates" OR "poverty reduction initiatives Asia" OR "poverty statistics" OR "economic inequality Asia" OR "poverty alleviation programs" OR "Asia developing countries" OR "poverty challenges Asia" OR "rural poverty Asia" OR "urban poverty Asia"

//     User: ${query}
//     ChatGPT: `;

//   // Uses formatRequestData to generate request Data
//   const requestData = formatRequestData(prompt);

//   let response = await fetch(URL, requestData);
//   // Promise object which resolves to Javascript Object (converted from JSON response)
//   return response.json();
// }


// QUERY FUNCTIONS ||
async function generateInitialQuery(query, promptFn) {
  // Returns promise object for json response data

  const prompt = promptFn(query);
  // Uses formatRequestData to generate request Data
  const requestData = formatRequestData(prompt);

  let response = await fetch(URL, requestData);
  // Promise object which resolves to Javascript Object (converted from JSON response)
  return response.json();
}

// function takes endpoint url and query object with param key-val pairs and returns full url

function formatUrl(url, paramObj) {
    // use URLSearchParams.toString() method
    let params = new URLSearchParams({
        query : `any,contains,${paramObj.query}`,
        tab : paramObj.tab ?? "Everything",
        search_scope : paramObj.tab ?? "Everything",
        vid : "65SMU_INST:SMU_NUI",
        offset : 0,
    });

    let paramString = params.toString();

    let resURL = url + paramString; 

    // Replace default '+' with SMU's variables
    console.log(resURL.replaceAll(/\+/g, "%20").replaceAll(/%2C/g, ","));

    return resURL;

}

function search() {
  var search = document.getElementById("basic-url").value;
  generateInitialQuery(search, altPrompt).then((data) => {
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
    chrome.tabs.update(
      {url:`https://search.library.smu.edu.sg/discovery/search?query=any,contains,${query}&tab=Everything&search_scope=Everything&vid=65SMU_INST:SMU_NUI&offset=0`},
    );
  });
}

const searchbutton = document.getElementById("submit");
searchbutton.addEventListener("click", search);

