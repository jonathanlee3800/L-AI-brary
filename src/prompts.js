

const mainPromptFn = query => 
    `write me a library search query, using appropriate boolean operators, parantheses grouping, and wildcards. 
    Make sure the query is as general as possible. Expand common abbreviations. 
    Exclude information about source type ("magazinearticle", 
    "book_chapters", 
    "articles",
    "conference_proceedings",
    "newsletterarticle",
    "dissertations",
    "reports",
    "newspaper_articles",
    "books",
    "web_resources",
    "text_resources",
    "conference_proceedings",
    "images",
    "reference_entrys",
    "archival_material_manuscripts",
    "videos") and publication date.

    User: Poverty in Asia magazine articles published in the last 5 years
    ChatGPT: Poverty in Asia AND Asian Poverty
    
    User: Electric Cars in Singapore ebooks published from 2017 to 2022
    ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore
    
    User: ${query}
    ChatGPT:`;
    
const paragraphPrompt = query => 
    `Following the given text excerpt, your task is to extract the primary themes and topics present within the text. 
    Formulate a search query that could be used in a library search, incorporating the identified main themes. 
    Your query should employ suitable boolean operators (AND, OR), use parentheses for grouping, 
    and integrate wildcards when needed. Aim for a broad and all-encompassing query. 
    Additionally, expand any commonly used abbreviations. 
    Exclude any details about the source type (magazine, newspaper, etc.) and the publication date. 
    It's important to avoid referencing the roles, titles, or positions of individuals.

    User: Recent advancements in AI have led to debates about its ethical implications and potential for job displacement. 
    Some experts claim that AI will drastically change the employment landscape by taking over tasks traditionally performed by humans. 
    This raises concerns about unemployment and the need for upskilling the workforce to be AI-compatible. 
    On the other hand, proponents of AI argue its potential to create new roles and industries, 
    leading to job growth in different sectors. The ethical aspect of AI is another major concern, 
    as the decision-making processes of AI systems are not always transparent. 
    This lack of transparency poses challenges in various applications, such as autonomous vehicles and medical diagnosis, 
    where the outcomes of AI decisions can significantly impact human lives.

    ChatGPT: (Ethical implications OR ethical concerns) AND (AI) AND (job displacement OR employment changes) AND (upskilling OR workforce training) AND (job growth OR new job opportunities) AND (transparency OR opaque decision-making) AND (autonomous vehicles OR medical diagnosis)
    
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

