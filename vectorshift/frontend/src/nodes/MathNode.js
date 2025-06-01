// nodes/mathNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const MathNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    operation: data?.operation || "add",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="Math"
      state={state}
      setState={setState}
      fields={[
        {
          name: "operation",
          label: "Operation",
          type: "select",
          options: ["add", "subtract", "multiply", "divide"],
        },
      ]}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: "a",
          style: { top: "33%" },
        },
        {
          type: "target",
          position: Position.Left,
          id: "b",
          style: { top: "66%" },
        },
        { type: "source", position: Position.Right, id: "result" },
      ]}
    />
  );
};
