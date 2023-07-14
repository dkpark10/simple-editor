import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useReducer,
} from "react";
import {
  setLastPosCaret,
  getContentByMiddleEnter,
  deleteMiddleContent,
  getCaretPos,
  setCaretPos,
  checkEndCaretPos,
} from "@/service";
import sampleImage from "/public/spr_share.png";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/editor.module.scss";

interface EditorState {
  id: number;
  contentType: "text" | "component";
  content?: React.JSX.Element | string;
}

type KeyInputState = 'Enter' | 'ArrowUp' | 'ArrowDown' | 'Backspace' | '';

function TempImage() {
  return <img width="100%" src={sampleImage.src} />;
}

export default function Editor2() {
  const [editorBlock, setEditorBlock] = useState<ReadonlyArray<EditorState>>([
    {
      id: 0,
      contentType: "text",
      content: undefined,
    },
  ]);

  const [editorElementRow, setEditorElementRow] = useState(0);

  const editorElementRef = useRef<Array<HTMLDivElement>>([]);

  const onKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentEditorElement = editorElementRef.current[editorElementRow];

    if (e.key === 'Backspace') {
      const caretPos = getCaretPos(currentEditorElement);
      /** @desc 커서가 첫 위치에서 백페스페이스 입력 시  */
      if (caretPos <= 0) {
        const firstLineContent = currentEditorElement.innerText.split('\n')[0];
      
      }
    } else if(e.key === 'Enter') {

    }
  };

  const onClick = () => {
    setEditorElementRow(prev => prev + 2);
    setEditorBlock((prev) => [
      ...prev, 
      {
        id: prev.length,
        contentType: 'component',
        content: <TempImage key={prev.length} />
      },
      {
        id: prev.length + 1,
        contentType: 'text',
      }
    ])
  };

  useEffect(() => {
    editorElementRef.current[editorElementRow].focus();
  }, [editorElementRow]);

  return (
    <>
      <main className={styles["container"]}>
        <button className={styles["test-btn"]} onClick={onClick}>
          클릭
        </button>
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
                onKeyDown={onKeyDown(idx)}
                onFocus={() => setEditorElementRow(idx)}
              />
            );
          } else {
            return content;
          }
        })}
      </main>
    </>
  );
}
