import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  JSX,
  Show,
  splitProps
} from "solid-js"
import { Heading } from "../components/Heading"
import { addScore, ExtendedPersonalInfoType, getAllInfo, modifyOtherInfo } from "../network"
import { formatDistanceToNow } from "date-fns"
import { createDialog } from "../components/Dialog"
import { createStore } from "solid-js/store"

const [info, { refetch }] = createResource(getAllInfo)

function TdInput(props: {
  username: string
  name: keyof ExtendedPersonalInfoType
  value: string
  setIsEditing: (value: boolean) => void
}) {
  // eslint-disable-next-line solid/reactivity
  const [text, setText] = createSignal(props.value)
  createEffect(() => {
    setText(props.value)
  })
  let myInput!: HTMLInputElement
  createEffect(() => {
    myInput.focus()
  })
  return (
    <input
      type="text"
      class="input input-sm input-ghost"
      value={text()}
      onInput={(ev) => setText(ev.currentTarget.value)}
      onBlur={() => {
        props.setIsEditing(false)
        if (text() == props.value) return
        modifyOtherInfo(props.username, props.name, text())
        refetch()
      }}
      ref={myInput}
    />
  )
}
function TdSelect(props: {
  username: string
  name: keyof ExtendedPersonalInfoType
  value: string
  setIsEditing: (value: boolean) => void
}) {
  // eslint-disable-next-line solid/reactivity
  const [text, setText] = createSignal(props.value)
  createEffect(() => {
    setText(props.value)
  })
  let mySelect!: HTMLSelectElement
  createEffect(() => {
    mySelect.focus()
  })
  return (
    <select
      class="select select-bordered select-xs"
      value={text()}
      onChange={(ev) => {
        setText(ev.currentTarget.value)
      }}
      onBlur={() => {
        props.setIsEditing(false)
        if (text() == props.value) return
        modifyOtherInfo(props.username, props.name, text())
        refetch()
      }}
      ref={mySelect}
    >
      <Show when={props.name == "is_admin"}>
        <option>Admin</option>
        <option>Member</option>
      </Show>
      <Show when={props.name == "gender"}>
        <option class="capitalize">male</option>
        <option class="capitalize">female</option>
        <option class="capitalize">others</option>
      </Show>
    </select>
  )
}

const [nameShowList, setNameShowList] = createStore<
  Record<keyof ExtendedPersonalInfoType, boolean>
>({
  gender: true,
  create_time: true,
  username: true,
  nickname: true,
  preferred_languages: true,
  is_admin: true,
  wx_id: true,
  score: true
})

function HidableTd(
  props: { name: keyof ExtendedPersonalInfoType } & JSX.DOMAttributes<HTMLTableCellElement>
) {
  const [local, others] = splitProps(props, ["name", "children"])
  return (
    <td class="capitalize" {...others}>
      <Show when={nameShowList[local.name]}>{local.children}</Show>
    </td>
  )
}

function HidableTh(
  props: { name: keyof ExtendedPersonalInfoType } & JSX.DOMAttributes<HTMLTableCellElement>
) {
  const [local, others] = splitProps(props, ["name", "children"])
  return (
    <th
      class="capitalize select-none"
      onDblClick={() => {
        setNameShowList(local.name, (value) => !value)
      }}
      {...others}
    >
      <Show when={!nameShowList[local.name]}>^</Show>
      {local.children}
    </th>
  )
}

function EditableTd(props: {
  username: string
  children: string
  name: keyof ExtendedPersonalInfoType
}) {
  const [isEditing, setIsEditing] = createSignal(false)
  return (
    <>
      <Show when={isEditing()}>
        <HidableTd name={props.name}>
          <Show when={props.name == "is_admin" || props.name == "gender"}>
            <TdSelect
              username={props.username}
              value={props.children}
              setIsEditing={setIsEditing}
              name={props.name}
            />
          </Show>
          <Show when={props.name != "is_admin" && props.name != "gender"}>
            <TdInput
              username={props.username}
              value={props.children}
              setIsEditing={setIsEditing}
              name={props.name}
            />
          </Show>
        </HidableTd>
      </Show>
      <Show when={!isEditing()}>
        <HidableTd
          name={props.name}
          onDblClick={() => {
            setIsEditing(true)
          }}
        >
          {props.children}
        </HidableTd>
      </Show>
    </>
  )
}

function AddScore(props: { username: string; hide: () => void }) {
  const [change, setChange] = createSignal(10)
  const [reason, setReason] = createSignal("")

  return (
    <>
      <tr>
        <td colspan={10} class="bg-base-100">
          <div class="flex">
            <form
              class="flex flex-col ml-auto gap-2"
              onSubmit={() => {
                props.hide()
                if (!reason()) return
                addScore(props.username, change(), reason()).then((ok) => {
                  if (!ok) {
                    createDialog({ title: "Add Score Failure", body: "Make sure you are admin." })
                  }
                })
              }}
            >
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">The score change</span>
                </div>
                <input
                  class="input input-bordered"
                  value={change().toString()}
                  type="text"
                  onInput={(ev) => {
                    const value = parseInt(ev.currentTarget.value, 10)
                    console.log({ value })
                    if (
                      Number.isNaN(value) ||
                      !Number.isFinite(value) ||
                      ~~value != value ||
                      value <= 0
                    ) {
                      ev.currentTarget.value = change().toString()
                      return
                    }
                    console.log({ value })
                    setChange(value)
                    ev.currentTarget.value = value.toString()
                  }}
                />
              </label>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Reason</span>
                </div>
                <input
                  class="input input-bordered"
                  value={reason()}
                  type="text"
                  onInput={(ev) => setReason(ev.currentTarget.value)}
                />
              </label>
              <div class="ml-auto">
                <button class="btn btn-primary" disabled={!reason()}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={10} class="p-0" />
      </tr>
    </>
  )
}

function DetailItem(props: { i: ExtendedPersonalInfoType; index: number }) {
  const [showAddScore, setShowAddScore] = createSignal(false)
  const username = createMemo(() => props.i.username)
  const [show, setShow] = createSignal(true)
  return (
    <>
      <tr>
        <th
          class="select-none"
          onDblClick={() => setShow((show) => !show)}
          classList={{
            "py-0": !show()
          }}
        >
          {props.index + 1}
        </th>
        <Show when={show()}>
          <HidableTd name="username">{username()}</HidableTd>
          <EditableTd username={username()} name="nickname">
            {props.i.nickname}
          </EditableTd>
          <EditableTd username={username()} name="gender">
            {props.i.gender}
          </EditableTd>
          <EditableTd username={username()} name="preferred_languages">
            {props.i.preferred_languages.join("; ")}
          </EditableTd>
          <EditableTd username={username()} name="is_admin">
            {props.i.is_admin ? "Admin" : "Member"}
          </EditableTd>
          <EditableTd username={username()} name="wx_id">
            {props.i.wx_id ?? ""}
          </EditableTd>
          <HidableTd name="create_time">
            {formatDistanceToNow(props.i.create_time, { addSuffix: true })}
          </HidableTd>
          <HidableTd name="score">{props.i.score}</HidableTd>
          <td class="py-0.5">
            <div class="tooltip" data-tip="Add score">
              <button
                class="btn btn-circle btn-ghost"
                onClick={() => {
                  setShowAddScore(!showAddScore())
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </td>
        </Show>
        <Show when={!show()}>
          <td colSpan={9} class="py-0" />
        </Show>
      </tr>
      <Show when={showAddScore()}>
        <AddScore
          username={username()}
          hide={() => {
            setShowAddScore(false)
          }}
        />
      </Show>
    </>
  )
}

function Details(props: { data: ExtendedPersonalInfoType[] }) {
  return (
    <>
      <For each={props.data}>{(i, index) => <DetailItem i={i} index={index()} />}</For>
    </>
  )
}

export default function Admin() {
  return (
    <div class="flex flex-col p-6">
      <Heading>List of members</Heading>
      <table class="table table-zebra overflow-x-auto">
        <thead>
          <tr>
            <th />
            <HidableTh name="username">Username</HidableTh>
            <HidableTh name="nickname">Nickname</HidableTh>
            <HidableTh name="gender">Gender</HidableTh>
            <HidableTh name="preferred_languages">Preferred languages</HidableTh>
            <HidableTh name="is_admin">Role</HidableTh>
            <HidableTh name="wx_id">Wechat ID</HidableTh>
            <HidableTh name="create_time">Create time</HidableTh>
            <HidableTh name="score">Score</HidableTh>
            <th class="select-none">Actions</th>
          </tr>
        </thead>
        <tbody>
          <Show when={info()}>
            <Details data={info()!} />
          </Show>
        </tbody>
      </table>
    </div>
  )
}
