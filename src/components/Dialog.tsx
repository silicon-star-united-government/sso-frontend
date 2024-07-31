import { createUniqueId, For, JSX } from "solid-js"
import { createStore, produce } from "solid-js/store"

interface DialogData {
  title: string
  body: JSX.Element
  id: string
}

const [dialogData, setDialogData] = createStore<DialogData[]>([])

export function createDialog({ title, body }: { title: string; body: JSX.Element }) {
  const id = createUniqueId()
  setDialogData(dialogData.length, { title, body, id })
  setTimeout(() => {
    const element = document.getElementById(id)! as HTMLDialogElement
    element.showModal()
  }, 100)
}

export function Dialogs() {
  return <For each={dialogData}>{(item) => <Dialog {...item} />}</For>
}

export function Dialog(props: { title: string; body: JSX.Element; id: string }) {
  return (
    <dialog id={props.id} class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">{props.title}</h3>
        <p class="py-4">{props.body}</p>
        <div class="modal-action">
          <form method="dialog">
            <button
              class="btn"
              onClick={() => {
                setTimeout(() => {
                  const index = dialogData.findIndex((i) => i.id == props.id)
                  if (index == -1) return
                  setDialogData(
                    produce((state) => {
                      state.splice(index, 1)
                    })
                  )
                }, 100)
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
