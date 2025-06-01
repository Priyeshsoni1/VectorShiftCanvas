// nodes/apiTriggerNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const ApiTriggerNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  // Get initial values from data or defaults
  const state = {
    url: data?.url || "",
    method: data?.method || "GET",
  };

  // Sync any updates to the global store
  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="API Trigger"
      state={state}
      setState={setState}
      fields={[
        { name: "url", label: "URL", type: "text" },
        {
          name: "method",
          label: "Method",
          type: "select",
          options: ["GET", "POST", "PUT", "DELETE"],
        },
      ]}
      handles={[
        { type: "target", position: Position.Left, id: "trigger" },
        { type: "source", position: Position.Right, id: "response" },
      ]}
    />
  );
};
