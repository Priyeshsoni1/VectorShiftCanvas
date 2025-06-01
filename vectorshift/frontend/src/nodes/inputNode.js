// nodes/inputNode.js
import { useState } from "react";
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);
  const state = {
    inputName: data?.inputName || "",
    inputType: data?.inputType || "Text",
  };
  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };
  return (
    <BaseNode
      id={id}
      label="Input"
      state={state}
      setState={setState}
      fields={[
        { name: "inputName", label: "Data", type: "text" },
        {
          name: "inputType",
          label: "Type",
          type: "select",
          options: ["Text", "File"],
        },
      ]}
      handles={[{ type: "source", position: Position.Right, id: "value" }]}
    />
  );
};
