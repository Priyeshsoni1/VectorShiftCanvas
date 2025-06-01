import { Handle } from "reactflow";
import styles from "./BaseNode.module.css";
import { shallow } from "zustand/shallow";
import { useStore } from "../../store";
import { useState, useEffect, useRef } from "react";

export const BaseNode = ({
  id,
  label,
  fields = [],
  handles = [],
  state,
  setState,
}) => {
  const deleteNode = useStore((state) => state.deleteNode, shallow);
  const allNodes = useStore((state) => state.nodes, shallow);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownField, setDropdownField] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);
  const inputRefs = useRef({});

  const nodeOptions = allNodes
    .filter((node) => node.id !== id)
    .map((node) => `${node.id}}}`);

  const handleTextChange = (e, fieldName) => {
    console.log("handleTextChange", e, fieldName);
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    // Show suggestions when typing {{
    if (cursor >= 2 && value.slice(cursor - 2, cursor) === "{{") {
      setDropdownField(fieldName);
      setCursorPos(cursor);
      setShowDropdown(true);
    }

    setState({ ...state, [fieldName]: value });
  };

  const handleInsert = (insertion) => {
    const field = dropdownField;
    if (!field || typeof state[field] !== "string") return;

    const original = state[field];
    const ref = inputRefs.current[field];

    if (cursorPos == null) return;

    const newValue =
      original.slice(0, cursorPos) + insertion + original.slice(cursorPos);

    setState({ ...state, [field]: newValue });
    setShowDropdown(false);

    // Refocus and update cursor after insertion
    setTimeout(() => {
      if (ref) {
        const newCursor = cursorPos + insertion.length;
        ref.focus();
        ref.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  return (
    <div className={styles.baseNode}>
      <div className={styles.baseNodeHeader}>
        <strong>{label}</strong>
        <button className={styles.deleteBtn} onClick={() => deleteNode(id)}>
          ×
        </button>
      </div>

      <div className={styles.baseNodeFields}>
        {fields.map((field) => (
          <div key={field.name} className={styles.baseNodeField}>
            <label>
              {field.label}:{field.type === "custom" && field.component}
              {field.type === "text" && (
                <div style={{ position: "relative" }}>
                  <input
                    ref={(el) => (inputRefs.current[field.name] = el)}
                    type="text"
                    value={state[field.name]}
                    onChange={(e) => handleTextChange(e, field.name)}
                  />
                  {showDropdown && dropdownField === field.name && (
                    <ul
                      className={styles.dropdown}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        background: "white",
                        border: "1px solid #ccc",
                        listStyle: "none",
                        margin: 0,
                        padding: "0.5em",
                        zIndex: 100,
                      }}
                    >
                      {nodeOptions.map((opt) => (
                        <li
                          key={opt}
                          style={{ cursor: "pointer", padding: "2px 6px" }}
                          onClick={() => handleInsert(opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {field.type === "select" && (
                <select
                  value={state[field.name]}
                  onChange={(e) =>
                    setState({ ...state, [field.name]: e.target.value })
                  }
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </div>
        ))}
      </div>

      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={`${id}-${h.id}`}
          style={h.style}
        />
      ))}
    </div>
  );
};
