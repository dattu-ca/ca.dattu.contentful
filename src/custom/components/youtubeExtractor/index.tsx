import React, {ReactNode, useCallback, useState} from "react";
import {Accordion, Box, Button, Card, EntryCard, Grid, Paragraph, Table, TextInput} from "@contentful/f36-components";
import axios, {AxiosResponse} from "axios";
import {youtube_v3} from "googleapis";
import {useSDK} from "@contentful/react-apps-toolkit";
import {FieldExtensionSDK} from "@contentful/app-sdk";
import {SettingsIcon} from "@contentful/f36-icons";
import {Spinner} from "@contentful/f36-spinner";
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import {convertTextToRichText} from "../../../utils/convertTextToRichText";


const options = {
    renderText: (text: string) => {
        return text?.split("\n").reduce((children: ReactNode[], textSegment, index) => {
            return [...children, index > 0 && <br key={index}/>, textSegment];
        }, []) || "";
    }
};


const extractId = (link: string) => {
    if (link) {
        const qs = link.split("?");
        const queries = qs[1].split("&");
        const params: Record<string, string> = queries.reduce((acc, curr) => {
            const param = curr.split("=");
            return {
                ...acc,
                [param[0]]: param[1]
            };
        }, {});
        return params?.["v"];
    }
    return undefined;
};

const fetchYoutube = (id: string) => {
    return axios.get(`http://localhost:3000/api/youtube/videos/get?id=${id}`);
};

const YoutubeExtractorComponent = () => {
    const sdk = useSDK<FieldExtensionSDK>();
    const [value, setValue] = useState(sdk.field.getValue() || "");
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<youtube_v3.Schema$Video | undefined>();
    const [accordion, setAccordion] = useState([true, true]);

    const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.currentTarget.value;
        return sdk.field.setValue(newValue).then(r => setValue(r));
    };

    const onGetYoutubeData = useCallback((link: string) => {
        setLoading(true);
        const linkId = (extractId(link));
        axios.get(`http://localhost:3000/api/youtube/videos/get?id=${linkId}`)
            .then((response: AxiosResponse<youtube_v3.Schema$VideoListResponse>) => {
                setItem(response?.data?.items?.[0]);
                setLoading(false);
            });
    }, []);

    const onSetFriendlyName = () => {
        const title = item?.snippet?.title;
        sdk.entry.fields.friendlyName.setValue(title).then(r => console.log(r)).catch(err => console.error(err));
    };

    const onSetName = () => {
        const title = item?.snippet?.title;
        sdk.entry.fields.name.setValue(title).then(r => console.log(r)).catch(err => console.error(err));
    };

    const onSetDescription = () => {
        const description = item?.snippet?.description;
        if (description) {
            const richText = convertTextToRichText(description as string);
            sdk.entry.fields.description.setValue(richText).then(r => console.log(r)).catch(err => console.error(err));
        }

    };


    return <Box>
        <TextInput value={value} onChange={onChangeText}/>
        {
            extractId(value)
            && (<Accordion>
                <Accordion.Item title="Youtube iFrame" isExpanded={accordion[0]}
                                onCollapse={() => setAccordion(prev => [false, prev[1]])}
                                onExpand={() => setAccordion(prev => [true, prev[1]])}>
                    <iframe width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${extractId(value)}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
                </Accordion.Item>
                <Accordion.Item title="Youtube Content" isExpanded={accordion[1]}
                                onCollapse={() => setAccordion(prev => [prev[0], false])}
                                onExpand={() => setAccordion(prev => [prev[1], true])}>
                    <Table style={{border: "1px solid #E7EBEE"}}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Cell width={180}>Field</Table.Cell>
                                <Table.Cell/>
                                <Table.Cell align="right">
                                    <Button onClick={() => onGetYoutubeData(value)}
                                            isDisabled={loading}
                                            variant="positive"
                                            endIcon={loading ? <Spinner variant="white"/> : <SettingsIcon
                                                variant="white"/>}>
                                        Fetch
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Head>
                        {
                            item
                            && (
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Paragraph>Friendly Name</Paragraph>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Paragraph>{item?.snippet?.title}</Paragraph>
                                        </Table.Cell>
                                        <Table.Cell align="right">
                                            <Button onClick={onSetFriendlyName}>Set</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Paragraph>Name</Paragraph>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Paragraph>{item?.snippet?.title}</Paragraph>
                                        </Table.Cell>
                                        <Table.Cell align="right">
                                            <Button onClick={onSetName}>Set</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Paragraph>Description</Paragraph>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div style={{wordBreak: "break-word"}}>
                                                {documentToReactComponents(convertTextToRichText(item?.snippet?.description as string), options)}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell align="right">
                                            <Button onClick={onSetDescription}>Set</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        }
                    </Table>
                </Accordion.Item>
            </Accordion>)
        }
    </Box>;
};

export default YoutubeExtractorComponent;