import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/editor.module.scss";

type KeyInput = 'Enter' | 'ArrowUp' | 'ArrowDown' | 'Backspace' | '';

export default function Editor() {
  const [contentBlock, setContentBlock] = useState([0]);

  const [currentRow, setCurrentRow] = useState(0);

  const [lastKeyInput, setLastKeyInput] = useState<KeyInput>('');

  const blockRef = useRef<Array<HTMLDivElement>>([]);

  const onkeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentRow(prev => prev + 1);
      setContentBlock(prev => [...prev, prev.length + 1]);
      setLastKeyInput('Enter');
    } else if (e.key === 'ArrowDown') {
      /** @desc 끝이면 */
      if (currentRow >= contentBlock.length - 1) {
        return;
      }
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

  useEffect(() => {
    if (lastKeyInput === 'Enter') {
      blockRef.current[currentRow].focus();
    } else if (lastKeyInput === 'ArrowDown' || lastKeyInput === 'ArrowUp') {
      blockRef.current[currentRow].focus();
    }
  }, [currentRow, lastKeyInput]);

  return (
    <main className={styles["container"]}>
      {contentBlock.map((blockId, idx) => (
        <div 
          className={[styles['content'], blockId].join(' ')}
          key={blockId} 
          contentEditable 
          ref={(element) => {
            if (!element) return;
            blockRef.current[idx] = element;
          }} 
          onKeyDown={onkeydown}
          onFocus={() => setCurrentRow(idx)}
        />
      ))}
    </main>
  );
}
