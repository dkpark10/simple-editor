import React, { useState, useRef, useEffect } from "react";
import { setLastPosCaret } from "@/service";

export default function EditorPage() {
  const [content, setContent] = useState("");

  const editorRef = useRef<HTMLDivElement | null>(null);

  const onInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.textContent || '');
  };

  useEffect(() => {
    setLastPosCaret(editorRef.current);
  })

  return (
    <div
      ref={editorRef}
      onInput={onInput}
      contentEditable
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
