import dynamic from "next/dynamic";
import Link from "next/link";

export default function EditorPage() {
  return (
    <>
      <Link href="/poll">poll</Link>
      <Link href="/chart">chart</Link>
    </>
  )
}
