const firstPrompt = query =>
    `find the main keywords for my prompt. Keep important keywords in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 1 keywords
      User: i want to seach for more information and articles about Poverty in Asia 
      ChatGPT: Poverty in Asia
  
      User: ${query}
      ChatGPT: `;

const altPrompt = query => 
    `write me a library search query, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible. Expand common abbreviations. Exclude information about source type (magazine, newspaper, etc.) and publication date.

    User: Poverty in Asia magazine articles published in the last 5 years
    ChatGPT: Poverty in Asia AND Asian Poverty
    
    User: Electric Cars in Singapore ebooks published from 2017 to 2022
    ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore
    
    User: ${query}
    ChatGPT:`;

const refinePrompt = (query, refine) => 
    `refine the given search query based on the user's instructions. Use appropriate boolean operators, parantheses grouping, and wildcards. Expand common abbreviations.

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


//   const prompt = `generate keywords for my prompt. suggest keywords that may relate to the search query, keep important queries in the front that directly relate to the query. seperate these keywords with "OR" and keep it to 10 keywords
//     User: Poverty in Asia
//     ChatGPT: "Poverty in Asia" OR "Asian poverty rates" OR "poverty reduction initiatives Asia" OR "poverty statistics" OR "economic inequality Asia" OR "poverty alleviation programs" OR "Asia developing countries" OR "poverty challenges Asia" OR "rural poverty Asia" OR "urban poverty Asia"

//     User: ${query}
//     ChatGPT: `;
