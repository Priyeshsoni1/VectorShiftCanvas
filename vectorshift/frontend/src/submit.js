// submit.js
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  async function submitPipeline() {
    console.log("Submitting pipeline with nodes:", nodes, "and edges:", edges);
    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit pipeline");
      }

      const result = await response.json();

      alert(
        `✅ Pipeline Summary:\n\n🔹 Nodes: ${result.num_nodes}\n🔹 Edges: ${
          result.num_edges
        }\n🔹 Is DAG: ${result.is_dag ? "Yes ✅" : "No ❌"}`
      );
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Submission failed. Check the console for more details.");
    }
  }

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={submitPipeline}
        style={{
          marginTop: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Submit{" "}
      </button>
    </div>
  );
};
