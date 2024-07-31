import { createEffect, createMemo, createResource, createSignal, Show, Suspense } from "solid-js"
import {
  getPersonalInfo,
  modifyPersonalInfo,
  PersonalInfoType,
  requestLogout,
  useCheckToken
} from "../network"
import { Heading } from "../components/Heading"
import { formatDistanceToNow } from "date-fns"
import { A } from "@solidjs/router"

function PersonalInfoData(props: PersonalInfoType & { refresh: () => void }) {
  // eslint-disable-next-line solid/reactivity
  const [gender, setGender] = createSignal<PersonalInfoType["gender"]>(props.gender)
  // eslint-disable-next-line solid/reactivity
  const [nickname, setNickname] = createSignal<PersonalInfoType["nickname"]>(props.nickname)
  const [preferredLanguages, setPreferredLanguages] = createSignal<string>(
    // eslint-disable-next-line solid/reactivity
    props.preferred_languages.join("; ")
  )
  const preferredLanguagesArray = createMemo(() =>
    preferredLanguages()
      .split(";")
      .map((item) => item.trim())
      .filter((a) => !!a)
  )
  createEffect(() => setGender(props.gender))
  createEffect(() => setNickname(props.nickname))
  createEffect(() => setPreferredLanguages(props.preferred_languages.join("; ")))
  const isValueChanged = createMemo(
    () =>
      gender() != props.gender ||
      nickname() != props.nickname ||
      JSON.stringify(preferredLanguagesArray().sort()) !=
        JSON.stringify(props.preferred_languages.sort())
  )
  async function update() {
    if (!isValueChanged()) return
    await modifyPersonalInfo({
      gender: gender(),
      nickname: nickname(),
      preferred_languages: preferredLanguagesArray()
    })
    props.refresh()
  }
  return (
    <div class="flex flex-col p-6">
      <Heading>Your Personal Information</Heading>
      <div class="grid md:grid-cols-2 gap-2">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Your gender</span>
          </div>
          <select
            class="select select-bordered"
            value={gender()}
            onChange={(ev) =>
              setGender(ev.currentTarget.value as unknown as PersonalInfoType["gender"])
            }
          >
            <option class="capitalize">male</option>
            <option class="capitalize">female</option>
            <option class="capitalize">others</option>
          </select>
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Favorite programming languages</span>
          </div>
          <input
            class="input input-bordered"
            value={preferredLanguages()}
            type="text"
            onInput={(ev) => setPreferredLanguages(ev.currentTarget.value)}
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Your nickname</span>
          </div>
          <input
            class="input input-bordered"
            value={nickname()}
            type="text"
            onInput={(ev) => setNickname(ev.currentTarget.value)}
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Your username</span>
          </div>
          <input class="input input-bordered" value={props.username} disabled type="text" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">The time your account was created</span>
          </div>
          <input
            class="input input-bordered"
            value={formatDistanceToNow(new Date(props.create_time), { addSuffix: true })}
            disabled
            type="text"
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Role</span>
          </div>
          <select
            class="select select-bordered"
            value={props.is_admin ? "Admin" : "Member"}
            disabled
          >
            <option>Admin</option>
            <option>Member</option>
          </select>
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Your WeChat ID (contact admin to change)</span>
          </div>
          <input class="input input-bordered" value={props.wx_id ?? ""} disabled type="text" />
        </label>
      </div>
      <button class="btn btn-primary ml-auto mt-4" disabled={!isValueChanged()} onClick={update}>
        Change
      </button>
      <Heading>Other actions</Heading>
      <Show when={props.is_admin}>
        <div class="join ml-auto mt-4">
          <A class="btn btn-secondary join-item" href="/admin">
            Go To Admin Dashboard
          </A>
          <button class="btn btn-accent join-item" onClick={requestLogout}>
            Logout
          </button>
        </div>
      </Show>
      <Show when={!props.is_admin || !props}>
        <button class="btn btn-accent join-item ml-auto mt-4" onClick={requestLogout}>
          Logout
        </button>
      </Show>
    </div>
  )
}

export default function PersonalInfo() {
  const [personalInfo, { refetch }] = createResource(getPersonalInfo)
  useCheckToken()
  return (
    <Suspense fallback={<></>}>
      <Show when={personalInfo()}>
        {(data) => <PersonalInfoData {...data()} refresh={refetch} />}
      </Show>
    </Suspense>
  )
}
