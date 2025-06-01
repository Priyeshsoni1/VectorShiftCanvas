// nodes/outputNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const OutputNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    outputName: data?.outputName || id.replace("customOutput-", "output_"),
    outputType: data?.outputType || "Text",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="Output"
      state={state}
      setState={setState}
      fields={[
        { name: "outputName", label: "Name", type: "text" },
        {
          name: "outputType",
          label: "Type",
          type: "select",
          options: ["Text", "Image"],
        },
      ]}
      handles={[{ type: "target", position: Position.Left, id: "value" }]}
    />
  );
};
