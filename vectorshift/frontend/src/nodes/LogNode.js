// nodes/logNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const LogNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    label: data?.label || "Log",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="Logger"
      state={state}
      setState={setState}
      fields={[{ name: "label", label: "Label", type: "text" }]}
      handles={[{ type: "target", position: Position.Left, id: "input" }]}
    />
  );
};
