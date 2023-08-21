
document.addEventListener("click", myFunction1);
document.addEventListener("click", myFunction2);

function myFunction1() {
  document.getElementById("demo").innerHTML += "First function was executed! ";
}

function myFunction2() {
  document.getElementById("demo").innerHTML += "Second function was executed! ";
}

/* test push for matthias */
async function generateInitialQuery(query){
    // Returns promise object for json response data
    
    const prompt =  `generate keywords for my prompt. suggest keywords that may relate to the search query, keep important queries in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 10 keywords
    User: Poverty in Asia
    ChatGPT: "Poverty in Asia" OR "Asian poverty rates" OR "poverty reduction initiatives Asia" OR "poverty statistics" OR "economic inequality Asia" OR "poverty alleviation programs" OR "Asia developing countries" OR "poverty challenges Asia" OR "rural poverty Asia" OR "urban poverty Asia"

    User: ${query}
    ChatGPT: `;

    const OPENAI_API_KEY = "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"
    const url = "https://api.openai.com/v1/chat/completions";
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
    };
      
    const requestData = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role:"system", content: prompt}],
            temperature: 0.6,
        })
    }
    
    return fetch(url, requestData).then(response => response.json());

}

console.log(generateInitialQuery("electric cars").then(data => {console.log(data.choices[0].message.content)}))



