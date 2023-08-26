let refineTextObj = {
    name: "refineText",
    description: "refine a library search query given certain instructions",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: `write me a library search query based on user's query, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible. Expand common abbreviations.

                User: Poverty in Asia
                ChatGPT: Poverty in Asia AND Asian Poverty
                
                User: Electric Cars in Singapore
                ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore`,
            },
            date: {
                type: "array",
                description: `Infer start year and end year based on user's query. User: give me results from 2021 to 2023
                ChatGPT: [2021, 2023]`,
                items: {
                    type: "string",
                },
            },
            rtype: {
                type: "string",
                enum: ["magazinearticle", "book_chapters", "articles"],
                description:
                    "Choose the appropriate type of resource based on user's query",
            },
        },
    },
};
