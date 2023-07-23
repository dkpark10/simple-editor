import React, { useRef, useState } from "react";
import sampleImage from "/public/spr_share.png";
import { useEditorImage, customElementTag } from "@/components/img-element";
import PlaceHolder from "@/components/placeholder";
import {
  setLastPosCaret,
  getContentByMiddleEnter,
  deleteMiddleContent,
  getCaretPos,
  setCaretPos,
  checkEndCaretPos,
} from "@/service";
import styles from "@/styles/editor.module.scss";

/**
 * @see {@link https://www.figma.com/file/8WiGKpzoRMe2FZsjEqUIdW/InvestingView_%EA%B3%A0%EB%8F%84%ED%99%94_%EA%B8%B0%ED%9A%8D?type=design&node-id=2389-35704&mode=design&t=dEQOkDKJn5DI84hD-0}
 */
const TITLE_LIMIT_LINE = 2;
const LIMIT_IMAGE_COUNT = 10;
const IMG_ID_PREFIX = "img-id-";
const ENTER_HTML = "<div><br/></div>";

function Editor() {
  const mainRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = (e:React.KeyboardEvent) => {
    if (!mainRef.current) return;
    console.log(getCaretPos(mainRef.current).caretPos);
  }

  const onClick = () => {
    if (!mainRef.current) return;
    console.log(mainRef.current.innerHTML.slice(0, 7) + mainRef.current.innerHTML.slice(7));
    const nn = mainRef.current.innerHTML.slice(0, 7) + `<div><img src=${sampleImage.src}></div>` + mainRef.current.innerHTML.slice(7);
    mainRef.current.innerHTML = nn;
  }

  return (
    <>
      <main className={styles["editor-content"]}>
        <div ref={mainRef} contentEditable onKeyDown={onKeyDown} />
      </main>
      <button onClick={onClick}>click</button>
    </>
  );
}

export default React.memo(Editor);
