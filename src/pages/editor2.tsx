import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  setLastPosCaret,
  getContentByMiddleEnter,
  deleteMiddleContent,
  getCaretPos,
  setCaretPos,
  checkEndCaretPos,
} from "@/service";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/editor.module.scss";

interface EditorState {
  id: number;
  contentType: 'text' | 'component';
  content: string | React.JSX.Element;
}

function Test() {
  return <button onClick={() => console.log(123)}>click</button>;
}

export default function Editor2() {
  const [editorBlock, setEditorBlock] = useState<ReadonlyArray<EditorState>>([
    {
      id: 0,
      contentType: "component",
      content: <Test key={0} />,
    },
  ]);

  const [currentRow, setCurrentRow] = useState(0);

  const editorElementRef = useRef<Array<HTMLDivElement>>([]);

  return (
    <main className={styles["container"]}>
      {editorBlock.map(({ content, id, contentType }, idx) => {
        if (contentType === "text") {
          return (
            <div
              className={[styles["content"], id].join(" ")}
              key={id}
              contentEditable
              ref={(element) => {
                if (!element) return;
                editorElementRef.current[idx] = element;
              }}
              onFocus={() => setCurrentRow(idx)}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        } else {
          return content;
        }
      })}
    </main>
  );
}
