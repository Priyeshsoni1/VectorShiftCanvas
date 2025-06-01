// nodes/openaiNode.js
import { Position } from "reactflow";
import { BaseNode } from "./abstractions/BaseNode";
import { useStore } from "../store";

export const OpenAINode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    prompt: data?.prompt || "",
    model: data?.model || "gpt-4",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="OpenAI"
      state={state}
      setState={setState}
      fields={[
        {
          name: "prompt",
          label: "Prompt",
          type: "text",
        },
        {
          name: "model",
          label: "Model",
          type: "select",
          options: ["gpt-3.5", "gpt-4", "gpt-4-turbo"],
        },
      ]}
      handles={[
        {
          id: "input",
          type: "target",
          position: Position.Left,
          style: { top: "50%" },
        },
        {
          id: "output",
          type: "source",
          position: Position.Right,
          style: { top: "50%" },
        },
      ]}
    />
  );
};
