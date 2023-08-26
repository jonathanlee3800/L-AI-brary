let refineTextObj = {
    name: "refineText",
    description: "refine a library search query given certain instructions",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: `write me a library search query based on user's query, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible. Expand common abbreviations. Exclude date and source type information.

                User: Poverty in Asia
                ChatGPT: Poverty in Asia AND Asian Poverty
                
                User: Electric Cars in Singapore
                ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore`,
            },
            searchcreationdate: {
                type: "array",
                description: `Infer start year and end year based on user's query. User: give me results from 2021 to 2023
                ChatGPT: [2021, 2023]`,
                items: {
                    type: "string",
                },
            },
            rtype: {
                type: "array",
                description: "Choose the appropriate types of resource (magazine articles, books, etc.) based on user's query as an array of relevant items",
                items: {
                    type: "string",
                    enum: ["magazinearticle", "book_chapters", "articles"],
                }
            },
        },
    },
};
