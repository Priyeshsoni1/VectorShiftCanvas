// nodes/imageNode.js
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";

export const ImageNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);

  const state = {
    imageUrl: data?.imageUrl || "",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  return (
    <BaseNode
      id={id}
      label="Image"
      state={state}
      setState={setState}
      fields={[{ name: "imageUrl", label: "Image URL", type: "text" }]}
      handles={[{ type: "source", position: Position.Right, id: "image" }]}
    />
  );
};
