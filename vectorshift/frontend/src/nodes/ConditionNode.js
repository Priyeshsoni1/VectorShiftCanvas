// nodes/conditionNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const ConditionNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    condition: data?.condition || "equals",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="Condition"
      state={state}
      setState={setState}
      fields={[
        {
          name: "condition",
          label: "Condition",
          type: "select",
          options: ["equals", "not_equals", "greater_than", "less_than"],
        },
      ]}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: "inputA",
          style: { top: "33%" },
        },
        {
          type: "target",
          position: Position.Left,
          id: "inputB",
          style: { top: "66%" },
        },
        { type: "source", position: Position.Right, id: "result" },
      ]}
    />
  );
};
