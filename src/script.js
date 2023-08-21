// document.addEventListener("click", myFunction1);
// document.addEventListener("click", myFunction2);

// function myFunction1() {
//   document.getElementById("demo").innerHTML += "First function was executed! ";
// }

// function myFunction2() {
//   document.getElementById("demo").innerHTML += "Second function was executed! ";
// }

/* test push for matthias */

// catch lack of API Key
const keyGet = await chrome.storage.sync.get(["OPENAI_API_KEY"]);
const OPENAI_API_KEY = keyGet.OPENAI_API_KEY;

OPENAI_API_KEY ?? chrome.runtime.openOptionsPage();

const URL = "https://api.openai.com/v1/chat/completions";

const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${OPENAI_API_KEY}`
};

console.log(HEADERS);

function formatRequestData(prompt, model="gpt-3.5-turbo", req_headers=HEADERS, temperature=0.6){
    // Function to generate request data
    return {
        method: "POST",
        headers: req_headers,
        body: JSON.stringify({
            model: model,
            messages: [{role:"system", content: prompt}],
            temperature: temperature,
        })
    };
}

async function generateInitialQuery(query){
    // Returns promise object for json response data
    
    const prompt =  `generate keywords for my prompt. suggest keywords that may relate to the search query, keep important queries in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 10 keywords
    User: Poverty in Asia
    ChatGPT: "Poverty in Asia" OR "Asian poverty rates" OR "poverty reduction initiatives Asia" OR "poverty statistics" OR "economic inequality Asia" OR "poverty alleviation programs" OR "Asia developing countries" OR "poverty challenges Asia" OR "rural poverty Asia" OR "urban poverty Asia"

    User: ${query}
    ChatGPT: `;

    // Uses formatRequestData to generate request Data
    const requestData = formatRequestData(prompt)

    let response = await fetch(URL, requestData);
    // Promise object which resolves to Javascript Object (converted from JSON response)
    return response.json();
}

console.log(generateInitialQuery("electric cars").then(data => {console.log(data.choices[0].message.content)}))



