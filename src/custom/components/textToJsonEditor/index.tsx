import React, {useState} from "react";
import {useSDK} from "@contentful/react-apps-toolkit";
import {FieldExtensionSDK} from "@contentful/app-sdk";
import SvelteJSONEditor from "./SvelteJSONEditor";


interface iOnChangeParam {
    json?: Object,
    text?: string

}

const TextToJsonEditorComponent = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const [jsonAsString, setJsonAsString] = useState((sdk.field.getValue() || JSON.stringify({}, null, 2)));

    const onChangeHandler = (newData: iOnChangeParam) => {
        const json = newData.json || JSON.parse(newData.text as string);
        if (json) {
            sdk.field.setValue(JSON.stringify(json))
                .then(response => {
                    setJsonAsString((response || JSON.stringify({}, null, 2)));
                });
        }
    };


    return <SvelteJSONEditor
        content={{
            text: jsonAsString
        }}
        readOnly={false}
        onChange={onChangeHandler}/>;
};


export default TextToJsonEditorComponent;