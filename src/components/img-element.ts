import { useEffect } from 'react';

export const customElementTag = 'editor-img';

export function useEditorImage() {
  useEffect(() => {
    if (customElements.get(customElementTag)) return;
    customElements.define(
      customElementTag,
      class ImageElement extends HTMLElement {
        constructor() {
          super();
        }

        /** @description DOM 추가이벤트 */
        connectedCallback() {
          // @ts-ignore
        }

        /** @description DOM 제거이벤트 */
        disconnectedCallback() {
          this.innerHTML = '';
        }

        /** @description 속성 추가 제거 콜백 */
        attributeChangedCallback(attrName: string, _: any, newVal: any) {
          // @ts-ignore
          this[attrName] = newVal;
        }
      }
    );
  }, []);
}
