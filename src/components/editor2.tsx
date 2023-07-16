/* eslint-disable @next/next/no-img-element */
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
  blockId: string;
  contentType: "text" | "component";
  src?: string;
}

interface TempImageProps {
  id: string;
  src: string;
  onDeleteClick: (
    id: string
  ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function TempImage({ id, onDeleteClick, src }: TempImageProps) {
  return (
    <>
      <button onClick={onDeleteClick(id)}>삭제</button>
      <img width="100%" alt="img" src={src} />
    </>
  );
}

export default function Editor2() {
  const [editorBlock, setEditorBlock] = useState<Array<EditorState>>([
    {
      blockId: `${uuidv4()}-id-0`,
      contentType: "text",
    },
  ]);

  const [editorElementRow, setEditorElementRow] = useState(0);

  const editorElementRef = useRef<Array<HTMLDivElement>>([]);

  const onKeyDown =
    (idx: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentEditorElement = editorElementRef.current[editorElementRow];

      if (e.key === "Backspace") {
        if (idx <= 0) return;
        const { caretPos, isFirstLine } = getCaretPos(currentEditorElement);
        /** @desc 커서가 첫 위치에서 백페스페이스 입력 시 */

        if (caretPos <= 0 && isFirstLine) {
          const currentElementText = currentEditorElement.innerText.split("\n");
          const firstLineContent = currentElementText[0];

          currentEditorElement.innerText = currentElementText
            .slice(1)
            .map((text) => `${text}\n`)
            .join(" ");

          let nextRow: number = idx - 1;
          const prevContentBlockType = editorBlock[nextRow].contentType;

          if (prevContentBlockType === "component") {
            let nextIdx = idx - 1;
            while (editorBlock[nextIdx].contentType !== "text") {
              nextIdx -= 1;
              nextRow = nextIdx;
            }
          } else {
            nextRow = editorElementRow - 1;
          }

          editorElementRef.current[nextRow].innerText += firstLineContent;
          setEditorElementRow(nextRow);
        }
      }
    };

  const onDeleteClick =
    (idx: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log(editorBlock);
      setEditorBlock((prev) => prev.filter(({ blockId }) => blockId !== idx));
      setEditorElementRow(0);
    };

  const onClick =
    (imgCount = 1) =>
    () => {
      setEditorElementRow((prev) => prev + imgCount + 1);
      setEditorBlock((prev) => {
        const id = uuidv4();
        return [
          ...prev,
          ...Array.from(
            { length: imgCount },
            (_, idx): EditorState => ({
              blockId: id + `-id-${prev.length + idx}`,
              contentType: "component",
              src: sampleImage.src,
            })
          ),
          {
            blockId: id + `-id-${prev.length + imgCount}`,
            contentType: "text",
          },
        ];
      });
    };

  useEffect(() => {
    if (editorBlock[editorElementRow].contentType === "component") {
      return;
    }

    setTimeout(() => {
      editorElementRef.current[editorElementRow].focus();
      setLastPosCaret(editorElementRef.current[editorElementRow]);
    }, 0);
  }, [editorBlock, editorElementRow]);

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
        {editorBlock.map(({ src, blockId, contentType }, idx) => {
          if (contentType === "text") {
            return (
              <div
                className={[styles["content"], blockId].join(" ")}
                key={blockId}
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
            return (
              <TempImage
                key={idx}
                id={blockId}
                onDeleteClick={onDeleteClick}
                src={src as string}
              />
            );
          }
        })}
      </main>
    </>
  );
}
