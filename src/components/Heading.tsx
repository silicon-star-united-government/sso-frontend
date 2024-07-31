import { JSX } from "solid-js"

export function Heading(props: { children?: JSX.Element }) {
  return (
    <>
      <div class="text-lg mt-2">{props.children}</div>
      <div class="divider" />
    </>
  )
}
