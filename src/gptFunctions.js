let refineTextObj = {
    name: "refineText",
    description: "refine a library search query given certain instructions",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                // description: `write me a library search query based on user's query, using appropriate boolean operators, parantheses grouping, and wildcards. Make sure the query is as general as possible. Expand common abbreviations. Exclude date and source type information.

                // Output based on this examples.
                // User: Poverty in Asia
                // ChatGPT: Poverty in Asia AND Asian Poverty
                
                // User: Electric Cars in Singapore
                // ChatGPT: ("Electric Cars" OR "Electric Vehicles") AND Singapore
                // `,
                description: "library search query to feed back to user."
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

let refineTextObj2 = {
    name: "refineText",
    description: "refine a library search query given certain instructions",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: `act as a Context Identifier to provide keywords that you will use in a library database search query. When providing keywords, provide 6 keywords that are relevant and present in the user's input. The user's input may contain more than one theme. If so, make sure all themes are covered by the keyword. Try not to repeat keywords that might provide similar context.

                Use appropriate boolean operators (OR or AND) and wildcards to make the query. Use query wildcards when the spelling of words are different for american and british spelling(colour vs color). You may also use wildcards whenever appropriate.
                `,
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

