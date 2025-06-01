// nodes/llmNode.js
import { Position } from "reactflow";
import { BaseNode } from "./abstractions/BaseNode";
import { useStore } from "../store";

export const LLMNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    system: data?.system || "",
    prompt: data?.prompt || "",
    model: data?.model || "gpt-4",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  const fields = [
    { name: "system", label: "System", type: "text" },
    { name: "prompt", label: "Prompt", type: "text" },
    {
      name: "model",
      label: "Model",
      type: "select",
      options: ["gpt-4", "gpt-3.5", "claude", "mixtral"],
    },
  ];

  const handles = [
    {
      id: "system",
      type: "target",
      position: Position.Left,
      style: { top: "33%" },
    },
    {
      id: "prompt",
      type: "target",
      position: Position.Left,
      style: { top: "66%" },
    },
    { id: "response", type: "source", position: Position.Right },
  ];

  return (
    <BaseNode
      id={id}
      label="LLM Node"
      fields={fields}
      handles={handles}
      state={state}
      setState={setState}
    />
  );
};
