import React, { useEffect, useRef, useState, useReducer, useLayoutEffect } from "react";
import {
  setLastPosCaret,
  getContentByMiddleEnter,
  deleteMiddleContent,
  getCaretPos,
  setCaretPos,
  checkEndCaretPos,
  lastCheckKorean,
  type ContentState,
} from "@/service";
import debounce from 'lodash-es/debounce';
import styles from "@/styles/editor.module.scss";

interface KeyInputState {
  type: 'Enter' | 'ArrowUp' | 'ArrowDown' | 'Backspace' | '';
  isChangedLine: boolean;
}

declare global {
  interface Window {
    LoungeEditor?: {
      onFocusEditor?: (focusFlag: boolean) => void;
      onGetGalleryImage?: (imgSrc: unknown) => void;
    };
  }
}

export default function Editor() {
  const [editorBlock, setEditorBlock] = useState<Array<ContentState>>([
    {
      id: 0,
    },
  ]);

  const [currentRow, setCurrentRow] = useState(0);

  const [lastKeyInput, setLastKeyInput] = useState<KeyInputState>({
    type: "",
    isChangedLine: false,
  });

  const editorElementRef = useRef<Array<HTMLDivElement>>([]);

  const contentTextRef = useRef<Array<string>>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    contentTextRef.current[currentRow] = e.currentTarget.innerText || "";
    const isEndBlock = currentRow >= editorBlock.length - 1;

    if (e.key === "Enter") {
      e.preventDefault();

      if (isEndBlock) {
        /** @desc 한글 두번 입력되는 이슈를 막기 위한 로직 */
        if (e.nativeEvent.isComposing) return;
        const { caretPos } = getCaretPos(editorElementRef.current[currentRow]);

        if (caretPos === undefined) return;
        /** @desc 처음 or 마지막 캐럿 위치라면 */
        if (
          caretPos >= editorElementRef.current[currentRow].innerText.length ||
          caretPos <= 0
        ) {
          setCurrentRow(currentRow + 1);
          setEditorBlock(
            (prev): Array<ContentState> => [
              ...prev,
              {
                id: prev.length,
              },
            ]
          );

          contentTextRef.current.push("");
        } else {
          /** @desc 중간위치에서 엔터 입력시 처리 */
        }
      } else {
        const nextRow = currentRow + 1;
        const { newBlockContent, blockContents } = getContentByMiddleEnter(
          contentTextRef.current,
          nextRow
        );

        contentTextRef.current = blockContents;
        setEditorBlock(newBlockContent);
        setCurrentRow(nextRow);
      }

      setLastKeyInput({ type: "Enter", isChangedLine: false });
    } else if (e.key === "Backspace") {
      /** @desc 처음 줄이 아니면서 빈 콘텐츠일 때 */
      if (contentTextRef.current[currentRow] === "" && currentRow >= 1) {
        const nextRow = currentRow - 1;
        const { newBlockContent, blockContents } = deleteMiddleContent(
          contentTextRef.current,
          currentRow
        );

        contentTextRef.current = blockContents;
        setEditorBlock(newBlockContent);
        setCurrentRow(nextRow);
        setLastKeyInput({ type: "Backspace", isChangedLine: true });
        return;
      }
      setLastKeyInput({ type: "Backspace", isChangedLine: false });
    }
  };

  useEffect(() => {
    editorElementRef.current[currentRow].focus();

    if (lastKeyInput.type === "Enter") {
    } else if (lastKeyInput.type === "Backspace") {
      /** @desc 백스페이스 입력 줄바꿀 때 이전 블록의 마지막 글자가 사라지는 이슈 방어로직 */
      if (lastKeyInput.isChangedLine) {
        setTimeout(() => {
          setLastPosCaret(editorElementRef.current[currentRow]);
        }, 0);
      } else {
        setLastPosCaret(editorElementRef.current[currentRow]);
      }
    }
  }, [currentRow, lastKeyInput]);

  return (
    <main className={styles["container"]}>
      {editorBlock.map((block, idx) => (
        <div
          className={[styles["content"], block.id].join(" ")}
          key={block.id}
          contentEditable
          ref={(element) => {
            if (!element) return;
            editorElementRef.current[idx] = element;
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setCurrentRow(idx)}
          dangerouslySetInnerHTML={{ __html: contentTextRef.current[idx] }}
        />
      ))}
    </main>
  );
}
