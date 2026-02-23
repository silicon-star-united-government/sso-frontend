import { createEffect, createMemo, createResource, createSignal, Show, Suspense } from "solid-js"
import { getPersonalInfo, modifyPersonalInfo, PersonalInfoType, requestLogout } from "../api"
import { useCheckToken } from "../auth"
import { Heading } from "../components/Heading"
import { formatDistanceToNow } from "date-fns"
import { A } from "@solidjs/router"
import { t } from "../i18n"

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
    <div class="container mx-auto flex flex-col p-6">
      <Heading>{t("personal_info")}</Heading>
      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("your_gender")}</span>
          </div>
          <select
            class="select select-bordered"
            value={gender()}
            onChange={(ev) =>
              setGender(ev.currentTarget.value as unknown as PersonalInfoType["gender"])
            }
          >
            <option value="male" class="capitalize">{t("male")}</option>
            <option value="female" class="capitalize">{t("female")}</option>
            <option value="others" class="capitalize">{t("others")}</option>
          </select>
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("fav_langs")}</span>
          </div>
          <input
            class="input input-bordered"
            value={preferredLanguages()}
            type="text"
            onInput={(ev) => setPreferredLanguages(ev.currentTarget.value)}
          />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("your_nickname")}</span>
          </div>
          <input
            class="input input-bordered"
            value={nickname()}
            type="text"
            onInput={(ev) => setNickname(ev.currentTarget.value)}
          />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("your_username")}</span>
          </div>
          <input class="input input-bordered" value={props.username} disabled type="text" />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("account_created")}</span>
          </div>
          <input
            class="input input-bordered"
            value={formatDistanceToNow(new Date(props.create_time), { addSuffix: true })}
            disabled
            type="text"
          />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("role")}</span>
          </div>
          <select
            class="select select-bordered"
            value={props.is_admin ? "Admin" : "Member"}
            disabled
          >
            <option value="Admin">{t("admin")}</option>
            <option value="Member">{t("member")}</option>
          </select>
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">{t("wx_id")}</span>
          </div>
          <input class="input input-bordered" value={props.wx_id ?? ""} disabled type="text" />
        </label>
      </div>
      <button class="btn btn-primary ml-auto mt-4" disabled={!isValueChanged()} onClick={update}>
        {t("change")}
      </button>
      <Heading>{t("other_actions")}</Heading>
      <Show when={props.is_admin}>
        <div class="join ml-auto mt-4">
          <A class="btn btn-secondary join-item" href="/admin">
            {t("go_admin")}
          </A>
          <button class="btn btn-accent join-item" onClick={requestLogout}>
            {t("logout")}
          </button>
        </div>
      </Show>
      <Show when={!props.is_admin || !props}>
        <button class="btn btn-accent join-item ml-auto mt-4" onClick={requestLogout}>
          {t("logout")}
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
