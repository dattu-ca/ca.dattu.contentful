import React, {Fragment, ReactNode, useEffect, useMemo} from "react";
import {Draggable, DraggingStyle, NotDraggingStyle} from "react-beautiful-dnd";
import {
    Box,
    Checkbox,
    DragHandle,
    IconButton,
    Select,
    TableCell,
    TableRow,
    TextInput
} from "@contentful/f36-components";
import {CheckCircleIcon, CloseIcon, DeleteIcon} from "@contentful/f36-icons";
import {iLink} from "./types";
import {createPortal} from "react-dom";


interface iEditorRow {
    link: iLink,
    index: number,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => void,
    isSetToDelete: boolean,
    onDelete: () => void,
    clearToDeleteId: () => void,
    setToDeleteId: () => void
}

const EditorRow = ({link, index, onChange, isSetToDelete, onDelete, clearToDeleteId, setToDeleteId}: iEditorRow) => {

    const portal = useMemo(() => document.createElement("tbody"), []);

    useEffect(() => {
        document.body.appendChild(portal);
        return () => {
            document.body.removeChild(portal);
        };
    }, [portal]);

    const port = (styles: DraggingStyle | NotDraggingStyle | undefined, element: any) => {
        if ((styles as DraggingStyle).position === "fixed") {
            return createPortal(element, portal);
        }
        return element;
    };

    return <Draggable draggableId={link.id.toString()}
                      index={index}>
        {
            (provided) => (
                <Fragment>
                    {
                        port(provided.draggableProps.style,
                            <TableRow ref={provided.innerRef}
                                {...provided.draggableProps}>
                                <TableCell>
                                    <DragHandle label="Move"
                                                {...provided.dragHandleProps}/>
                                </TableCell>
                                <TableCell>
                                    <TextInput
                                        value={link.label}
                                        name="label"
                                        size="small"
                                        placeholder="Label"
                                        onChange={onChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextInput
                                        value={link.url}
                                        name="url"
                                        size="small"
                                        placeholder="url"
                                        onChange={onChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={link.target}
                                        name="target"
                                        onChange={onChange}
                                    >
                                        <Select.Option
                                            value="_self">_self</Select.Option>
                                        <Select.Option
                                            value="_blank">_blank</Select.Option>

                                    </Select>
                                </TableCell>
                                <TableCell align="center" style={{
                                    verticalAlign: "middle",
                                    textAlign: "center"
                                }}>
                                    <Checkbox name="visible"
                                              isChecked={link.visible}
                                              onChange={onChange}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        isSetToDelete ? (
                                                          <Box>
                                                              <IconButton icon={
                                                                  <CheckCircleIcon
                                                                      variant="negative"/>}
                                                                          aria-label={"Confirm Delete"}
                                                                          size="small"
                                                                          style={{
                                                                              paddingLeft: 6,
                                                                              paddingRight: 6
                                                                          }}
                                                                          onClick={onDelete}/>
                                                              <IconButton
                                                                  icon={<CloseIcon
                                                                      variant="positive"/>}
                                                                  aria-label={"Cancel Delete"}
                                                                  size="small"
                                                                  style={{
                                                                      paddingLeft: 6,
                                                                      paddingRight: 6
                                                                  }}
                                                                  onClick={clearToDeleteId}/>
                                                          </Box>)
                                                      : (
                                            <Box>
                                                <IconButton
                                                    icon={<DeleteIcon
                                                        variant="negative"/>}
                                                    aria-label={"Delete"}
                                                    size="small"
                                                    style={{
                                                        paddingLeft: 6,
                                                        paddingRight: 6
                                                    }}
                                                    onClick={setToDeleteId}/>
                                            </Box>)
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    }
                </Fragment>
            )
        }
    </Draggable>;
};

export default EditorRow;