import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const Working = ({ words, columnNames, resultStateSetter, locale }) => {
  const taskStatus = {
    left: {
      name:
        columnNames.length > 0 && columnNames[0].id === "left"
          ? columnNames[0]?.name
          : columnNames[1]?.name,
      items: [],
      english_name:
        columnNames.length > 0 && columnNames[0].id === "left"
          ? columnNames[0]?.english_name
          : columnNames[1]?.english_name,
      french_name:
        columnNames.length > 0 && columnNames[0].id === "left"
          ? columnNames[0]?.french_name
          : columnNames[1]?.french_name,
    },
    words: {
      name: "",
      items: words,
    },
    right: {
      name:
        columnNames.length > 0 && columnNames[0].id === "right"
          ? columnNames[0]?.name
          : columnNames[1]?.name,
      items: [],
      english_name:
        columnNames.length > 0 && columnNames[0].id === "right"
          ? columnNames[0]?.english_name
          : columnNames[1]?.english_name,
      french_name:
        columnNames.length > 0 && columnNames[0].id === "right"
          ? columnNames[0]?.french_name
          : columnNames[1]?.french_name,
    },
  };

  const [columns, setColumns] = useState(taskStatus);

  useEffect(() => {
    resultStateSetter(columns);
  }, [resultStateSetter, columns]);

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Grid container spacing={4}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Grid item key={columnId} xs={12} s={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {locale === "ru"
                        ? column.name
                        : locale === "en"
                        ? column.english_name
                        : column.french_name}
                    </Typography>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "white",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                          bgcolor: "background.paper",
                                          pt: 1,
                                          pb: 1,
                                          m: 1,
                                          boxShadow: 1,
                                          opacity: snapshot.isDragging
                                            ? 0.5
                                            : 1,
                                          cursor: "move",
                                        }}
                                      >
                                        {locale === "ru"
                                          ? item.word
                                          : locale === "en"
                                          ? item.english_name
                                          : item.french_name}
                                      </Box>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </Box>
                        );
                      }}
                    </Droppable>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </DragDropContext>
      </Grid>
    </Container>
  );
};

export default Working;
