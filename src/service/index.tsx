export interface ContentState {
  id: number;
  content: string;
}

export const setLastPosCaret = (element: HTMLElement | null) => {
  if (!element) return;
  if (element.innerText.length === 0) {
    element.focus();
    return;
  }
 
  const selection = window.getSelection();
  const newRange = document.createRange();

  newRange.selectNodeContents(element);
  newRange.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(newRange);
};

/** 중간 블록에서 엔터시 블록에 들어칼 컨텐츠를 새로 만들고 반환하는 함수 */
export const insertMiddleContent = (oldContentBlock: Array<ContentState>, middleRow: number) => {
  const totalLen = oldContentBlock.length + 1;

  const blockContents = [
    ...oldContentBlock.slice(0, middleRow).map(({ content }) => content),
    "",
    ...oldContentBlock.slice(middleRow).map(({ content }) => content),
  ];

  const newBlockContent: Array<ContentState> = Array.from({ length: totalLen }, (_, idx) => ({
    id: idx,
    content: blockContents[idx],
  })); 

  return newBlockContent;
}