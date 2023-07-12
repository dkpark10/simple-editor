import React, { useEffect, useRef, useState } from "react";
import {
  setLastPosCaret,
  insertMiddleContent,
  type ContentState,
} from "@/service";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/editor.module.scss";

type KeyInput = 'Enter' | 'ArrowUp' | 'ArrowDown' | 'Backspace' | '';

export default function Editor() {
  const [contentBlock, setContentBlock] = useState<Array<ContentState>>([
    {
      id: 0,
      content: "",
    },
  ]);

  const [currentRow, setCurrentRow] = useState(0);

  const [lastKeyInput, setLastKeyInput] = useState<KeyInput>('');

  const blockRef = useRef<Array<HTMLDivElement>>([]);

  const editorRef = useRef<HTMLDivElement | null>(null);

  const isEndBlock = currentRow >= contentBlock.length - 1;

  const onkeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isEndBlock) {
        setCurrentRow(prev => prev + 1);
        setContentBlock((prev) => [
          ...prev,
          {
            id: prev.length,
            content: "",
          },
        ]);
      } else {
        const nextRow = currentRow + 1;
        const newBlockContent = insertMiddleContent(contentBlock, nextRow);

        setContentBlock(newBlockContent);
        setCurrentRow(nextRow);
      }

      setLastKeyInput('Enter');
    } else if (e.key === 'ArrowDown') {
      /** @desc 끝이면 */
      if (isEndBlock) return;

      setCurrentRow(prev => prev + 1);
      setLastKeyInput('ArrowDown');
    } else if (e.key === 'ArrowUp') {
      /** @desc 처음이면 */
      if (currentRow <= 0) {
        return;
      }
      setCurrentRow(prev => prev - 1);
      setLastKeyInput('ArrowUp');
    }
  }

  const onInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const newContentBlock = [...contentBlock];
    newContentBlock[currentRow].content = e.currentTarget.textContent || '';
    setContentBlock(newContentBlock);
  };

  /** @desc 매번 글 작성시 해당 줄의 엘리먼트 커서를 뒤로 보내줘야 한다. */
  useEffect(() => {
    setLastPosCaret(blockRef.current[currentRow]);
  })

  useEffect(() => {
    if (lastKeyInput === 'Enter') {
      blockRef.current[currentRow].focus();
    } else if (lastKeyInput === 'ArrowDown' || lastKeyInput === 'ArrowUp') {
      blockRef.current[currentRow].focus();
    }
  }, [currentRow, lastKeyInput]);

  return (
    <main ref={editorRef} className={styles["container"]}>
      {contentBlock.map((block, idx) => (
        <div 
          className={[styles['content'], block.id].join(' ')}
          key={block.id} 
          contentEditable 
          ref={(element) => {
            if (!element) return;
            blockRef.current[idx] = element;
          }} 
          onKeyDown={onkeydown}
          onInput={onInput}
          onFocus={() => setCurrentRow(idx)}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      ))}
    </main>
  );
}
