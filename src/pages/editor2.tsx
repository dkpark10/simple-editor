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
      if (idx <= 0) return;
      const { caretPos, isFirstLine } = getCaretPos(currentEditorElement);
      /** @desc 커서가 첫 위치에서 백페스페이스 입력 시 */
      if (caretPos <= 0 && isFirstLine) {
        const currentElementText = currentEditorElement.innerText.split('\n');
        const firstLineContent = currentElementText[0];

        currentEditorElement.innerText = currentElementText
          .slice(1)
          .map((text) => `${text}\n`)
          .join(" ");

        const prevContentBlockType = editorBlock[idx - 1].contentType;
        let nextRow;

        if (prevContentBlockType === 'component') {
          nextRow = editorElementRow - 2;
        } else {
          nextRow = editorElementRow - 1;
        }

        editorElementRef.current[nextRow].innerText += firstLineContent;
        setEditorElementRow(nextRow);
      }
    } else if (e.key === "Enter") {
    }
  };

  const onClick = (imgCount = 1) => () => {
    setEditorElementRow(prev => prev + imgCount + 1);
    setEditorBlock((prev) => [
      ...prev, 
      ...Array.from({ length: imgCount }, (_, idx): EditorState => ({
        id: prev.length + idx,
        contentType: "component",
        content: <TempImage key={prev.length + idx} />,
      })),
      {
        id: prev.length + imgCount,
        contentType: "text",
      }
    ]);
  };

  useEffect(() => {
    if (editorBlock[editorElementRow].contentType === 'component') {
      return;
    }

    setTimeout(() => {
      editorElementRef.current[editorElementRow].focus();
      setLastPosCaret(editorElementRef.current[editorElementRow]);
    }, 0)

  }, [editorBlock, editorElementRow]);

  console.log(editorBlock);
  return (
    <>
      <main className={styles["container"]}>
        <div className={styles["btn-container"]}>
          <button className={styles["test-btn"]} onClick={onClick()}>
            한장 렌더링
          </button>
          <button className={styles["test-btn"]} onClick={onClick(3)}>
            여러장 렌더링
          </button>
        </div>
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
