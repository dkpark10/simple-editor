import dynamic from 'next/dynamic';

const Editor2 = dynamic(() => import('@/components/editor2'), {
  ssr: false,
});

const initHtml = `
<div><button class="editor_test-btn__ra2yx">한장 렌더링</button><button class="editor_test-btn__ra2yx">
여러장 렌더링</button></div><div class="editor_content__Ge6bH 0" contenteditable="true">asddasdas<div>
dsaasdsa</div><div>sadasd</div><div><br></div></div><img width="100%" src="/_next/static/media/spr_share.27cab484.png">
<img width="100%" src="/_next/static/media/spr_share.27cab484.png"><img width="100%" src="/_next/static/media/spr_share.27cab484.png">
<div class="editor_content__Ge6bH 4" contenteditable="true">dsadsa<div><br></div></div><img width="100%" src="/_next/static/media/spr_share.27cab484.png">
<div class="editor_content__Ge6bH 6" contenteditable="true"></div>
`

export default function Index2() {
  return <Editor2 />;
}
