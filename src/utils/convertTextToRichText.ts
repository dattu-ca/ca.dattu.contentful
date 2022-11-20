import {BLOCKS, Document} from "@contentful/rich-text-types";


export const convertTextToRichText = (str: string) => {
    const doc: Document = {
        "nodeType": BLOCKS.DOCUMENT,
        "data": {},
        "content": [
            {
                "nodeType": BLOCKS.PARAGRAPH,
                "data": {},
                "content": [
                    {
                        "nodeType": "text",
                        "value": str,
                        "marks": [],
                        "data": {}
                    }
                ]
            }
        ]
    };
    return doc;
};