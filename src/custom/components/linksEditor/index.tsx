import React, {Fragment, useState} from "react";
import {useSDK} from "@contentful/react-apps-toolkit";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextInput
} from "@contentful/f36-components";
import {
    PlusCircleIcon,
    PreviewIcon
} from "@contentful/f36-icons";
import {FieldExtensionSDK} from "@contentful/app-sdk";

import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";

import {iLink, tTarget} from "./types";
import EditorRow from "./editorRow";


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

    const onDragEndHandler = ({source, destination}: DropResult) => {
        if (!destination) {
            return null;
        }
        console.log(source, destination);
    };


    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell/>
                    <TableCell>Label</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>target</TableCell>
                    <TableCell><PreviewIcon variant="muted"/></TableCell>
                    <TableCell width={105}/>
                </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId="CaDattuContentfulLinkEditor">
                    {
                        (provided, snapshot) => (
                            <TableBody ref={provided.innerRef}>
                                <>
                                    {
                                        console.log("Droppable", provided)
                                    }
                                    {
                                        linksArray.map((link, index) => (
                                            <EditorRow key={link.id}
                                                       link={link}
                                                       onChange={(e) => onChangeHandler(link.id, e)}
                                                       index={index}
                                                       setToDeleteId={() => setToDeleteId(link.id)}
                                                       clearToDeleteId={() => setToDeleteId(undefined)}
                                                       isSetToDelete={toDeleteId === link.id}
                                                       onDelete={() => onDeleteHandler(link.id)}
                                            />
                                        ))
                                    }
                                </>
                            </TableBody>
                        )
                    }
                </Droppable>
            </DragDropContext>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={6}>
                        <Button variant="transparent"
                                startIcon={<PlusCircleIcon variant="primary" size="large"/>}
                                onClick={onAddHandler}>
                            Add
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default LinksEditorComponent;