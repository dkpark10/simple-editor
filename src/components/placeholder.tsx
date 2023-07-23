import styles from '@/components/editor/editor.module.scss';

export default function PlaceHolder() {
  return (
    <div className={styles['placeholder']}>
      <div className={styles['main-text']}>내용을 입력해주세요.</div>
      <div className={styles['main-text']}>본문에 #을 이용해 주식을 입력해보세요.</div>
      <div className={styles['main-text']}>띄어쓰기가 있거나 영문으로 작성할 경우 태깅이</div>
      <div className={styles['main-text']}>안될 수 있습니다. (단, 대소문자는 가능)</div>
      <br />
      <div className={styles['extra-text']}>#카카오(0), #kakao(X)</div>
      <div className={styles['extra-text']}>#LG에너지솔루션(0), lg에너지솔루션(0)</div>
    </div>
  );
}