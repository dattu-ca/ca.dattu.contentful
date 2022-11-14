import React, {useEffect} from "react";
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import TextToJsonEditorComponent from "../custom/components/textToJsonEditor";

const Field = () => {
  const location = window.location.href.split("/").pop() as string;
  const sdk = useSDK<FieldExtensionSDK>();
  useEffect(() => sdk.window.startAutoResizer(), [sdk.window]);  
  
  switch (location){
    case "text-to-json-editor":{
      return <TextToJsonEditorComponent />
    }
    default:{
      return <Paragraph>Did not yet implement (AppId: {sdk.ids.app}), location: {location}</Paragraph>;
    }
  }
};

export default Field;
