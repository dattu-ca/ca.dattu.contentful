import React from "react";
import {useSDK} from "@contentful/react-apps-toolkit";
import {FieldExtensionSDK} from "@contentful/app-sdk";
import SvelteJSONEditor from "./SvelteJSONEditor";


interface iOnChangeParam {
    json?: Object,
    text?: string

}

const TextToJsonEditorComponent = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const onChangeHandler = (newData: iOnChangeParam) => {
        const json = newData.json || JSON.parse(newData.text as string);
        if (json) {
            sdk.field.setValue(JSON.stringify(json))
                .then(response => console.log("response", response));
        }
    };


    return <SvelteJSONEditor
        content={{
            text: (sdk.field.getValue() || JSON.stringify({}, null, 2))
        }}
        readOnly={false}
        onChange={onChangeHandler}/>;
};


export default TextToJsonEditorComponent;