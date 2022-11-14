import React, {useState} from "react";
import {useSDK} from "@contentful/react-apps-toolkit";
import {
    Box,
    Button, Checkbox,
    DragHandle,
    IconButton, Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextInput
} from "@contentful/f36-components";
import {PlusCircleIcon, DeleteIcon, CheckCircleIcon, CloseIcon, PreviewIcon} from "@contentful/f36-icons";

import {FieldExtensionSDK} from "@contentful/app-sdk";


type tTarget = "_blank" | "_self"

interface iLink {
    id: number;
    sequence: number;
    url: string;
    label: string;
    target: tTarget;
    visible: boolean;
}


const LinksEditorComponent = () => {
    const sdk = useSDK<FieldExtensionSDK>();

    const data = sdk.field.getValue();
    const [linksArray, setLinksArray] = useState<iLink[]>(JSON.parse(data || "[]"));
    const [toDeleteId, setToDeleteId] = useState<number | undefined>(undefined);

    const onAddHandler = () => {
        const newLink: iLink = {
            id: Date.now(),
            sequence: linksArray.length,
            url: "",
            label: "",
            target: "_self",
            visible: true
        };
        const newLinksArray = [...linksArray, newLink];
        sdk.field.setValue(JSON.stringify(newLinksArray))
            .then(response => setLinksArray(JSON.parse(response?.toString() || "[]") as iLink[]));
    };

    const onDeleteHandler = (id: number) => {
        const newLinksArray = linksArray.filter(link => link.id !== id);
        sdk.field.setValue(JSON.stringify(newLinksArray))
            .then(response => {
                setLinksArray(JSON.parse(response?.toString() || "[]") as iLink[]);
                setToDeleteId(undefined);
            });
    };

    const onChangeHandler = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newLinksArray = [...linksArray];
        const link = newLinksArray.find(item => item.id === id);
        let doChange = true;
        if (link) {
            const key = e.currentTarget.name;
            switch (key) {
                case "label":
                    link.label = e.currentTarget.value;
                    break;
                case "url":
                    link.url = e.currentTarget.value;
                    break;
                case "target":
                    link.target = e.currentTarget.value as tTarget;
                    break;
                case "visible":
                    link.visible = !link.visible;
                    break;
                default:
                    doChange = false;
                    break;
            }
            if (doChange) {
                sdk.field.setValue(JSON.stringify(newLinksArray))
                    .then(response => {
                        setLinksArray(JSON.parse(response?.toString() || "[]") as iLink[]);
                        setToDeleteId(undefined);
                    });
            }

        }
    };


    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Move</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>target</TableCell>
                <TableCell><PreviewIcon variant="muted"/></TableCell>
                <TableCell width={105}/>
            </TableRow>
        </TableHead>
        <TableBody>
            <>
                {
                    linksArray.map(link => (
                        <TableRow key={link.id}>
                            <TableCell><DragHandle label="Move"/></TableCell>
                            <TableCell>
                                <TextInput
                                    value={link.label}
                                    name="label"
                                    size="small"
                                    placeholder="Label"
                                    onChange={(e) => onChangeHandler(link.id, e)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={link.url}
                                    name="url"
                                    size="small"
                                    placeholder="url"
                                    onChange={(e) => onChangeHandler(link.id, e)}
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={link.target}
                                    name="target"
                                    onChange={(e) => onChangeHandler(link.id, e)}
                                >
                                    <Select.Option value="_self">_self</Select.Option>
                                    <Select.Option value="_blank">_blank</Select.Option>

                                </Select>
                            </TableCell>
                            <TableCell align="center" style={{
                                verticalAlign: "middle",
                                textAlign: "center"
                            }}>
                                <Checkbox name="visible"
                                          isChecked={link.visible}
                                          onChange={(e) => onChangeHandler(link.id, e)}/>
                            </TableCell>
                            <TableCell align="right">
                                {
                                    (toDeleteId === link.id) ? (<Box>
                                                                 <IconButton icon={<CheckCircleIcon variant="negative"/>}
                                                                             aria-label={"Confirm Delete"}
                                                                             size="small"
                                                                             style={{
                                                                                 paddingLeft: 6,
                                                                                 paddingRight: 6
                                                                             }}
                                                                             onClick={() => onDeleteHandler(link.id)}/>
                                                                 <IconButton icon={<CloseIcon variant="positive"/>}
                                                                             aria-label={"Cancel Delete"}
                                                                             size="small"
                                                                             style={{
                                                                                 paddingLeft: 6,
                                                                                 paddingRight: 6
                                                                             }}
                                                                             onClick={() => setToDeleteId(undefined)}/>
                                                             </Box>)
                                                             : (<Box>
                                                                 <IconButton
                                                                     icon={<DeleteIcon variant="negative"/>}
                                                                     aria-label={"Delete"}
                                                                     size="small"
                                                                     style={{
                                                                         paddingLeft: 6,
                                                                         paddingRight: 6
                                                                     }}
                                                                     onClick={() => setToDeleteId(link.id)}/>
                                                             </Box>)
                                }
                            </TableCell>
                        </TableRow>
                    ))
                }
                <TableRow>
                    <TableCell colSpan={6}>
                        <Button variant="transparent"
                                startIcon={<PlusCircleIcon variant="primary" size="large"/>}
                                onClick={onAddHandler}>
                            Add
                        </Button>
                    </TableCell>
                </TableRow>
            </>
        </TableBody>

    </Table>;
};

export default LinksEditorComponent;