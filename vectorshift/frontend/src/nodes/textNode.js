// nodes/TextNode.js
import { useEffect, useMemo, useRef, useState } from "react";
import { BaseNode } from "./abstractions/BaseNode";
import { Position } from "reactflow";
import { useStore } from "../store";
import styles from "./abstractions/BaseNode.module.css"; // Assuming styles are here

const VARIABLE_REGEX = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;

export const TextNode = ({ id, data }) => {
  const updateField = useStore((state) => state.updateNodeField);
  const allNodes = useStore((state) => state.nodes);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownField, setDropdownField] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);
  const inputRefs = useRef({});

  const state = {
    text: data?.text || "",
  };

  const setState = (newState) => {
    for (const key in newState) {
      updateField(id, key, newState[key]);
    }
  };

  const textRef = useRef(null);

  const nodeOptions = allNodes
    .filter((node) => node.id !== id)
    .map((node) => `${node.id}}}`);

  const handleTextChange = (e, fieldName) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    if (cursor >= 2 && value.slice(cursor - 2, cursor) === "{{") {
      setDropdownField(fieldName);
      setCursorPos(cursor);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
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

    setTimeout(() => {
      if (ref) {
        const newCursor = cursorPos + insertion.length;
        ref.focus();
        ref.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  const variableHandles = useMemo(() => {
    const vars = new Set();
    let match;
    while ((match = VARIABLE_REGEX.exec(state.text)) !== null) {
      vars.add(match[1]);
    }
    return [...vars].map((variable) => ({
      id: variable,
      type: "target",
      position: Position.Left,
      style: { top: "auto" },
    }));
  }, [state.text]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [state.text]);

  return (
    <BaseNode
      id={id}
      label="Text"
      state={state}
      setState={setState}
      fields={[
        {
          name: "text",
          label: "Text",
          type: "custom",
          component: (
            <div style={{ position: "relative" }}>
              <textarea
                ref={(el) => {
                  textRef.current = el;
                  inputRefs.current["text"] = el;
                }}
                className="text-node-textarea"
                value={state.text}
                onChange={(e) => handleTextChange(e, "text")}
                placeholder="Enter text with {{variables}}"
                rows={1}
                style={{
                  resize: "none",
                  width: "100%",
                  fontSize: "14px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: "#111827",
                  maxWidth: "90%",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              />
              {showDropdown && dropdownField === "text" && (
                <ul className={styles.dropdown}>
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
          ),
        },
      ]}
      handles={[
        ...variableHandles,
        { id: "output", type: "source", position: Position.Right },
      ]}
    />
  );
};
