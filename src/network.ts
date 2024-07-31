import { useNavigate } from "@solidjs/router"
import { createEffect, createSignal, Signal } from "solid-js"
import CookiesDefault from "js-cookie"
import type { Faker } from "@faker-js/faker"

let faker!: Faker

const Cookies = CookiesDefault.withAttributes({
  domain: document.domain == "sso.ssug.top" ? "ssug.top" : document.domain,
  sameSite: "strict",
  expires: new Date("9999-12-29 23:59:59")
  // secure: true
})

if (import.meta.env.DEV) {
  import("@faker-js/faker").then((module) => (faker = module.faker))
}

const [token, setToken] = (function (): Signal<string | null> {
  const [token, setToken] = createSignal<string | null>(null)
  const cookieToken = Cookies.get("token")
  if (cookieToken) {
    setToken(cookieToken)
  }
  createEffect(() => {
    const getToken = token()
    if (getToken) {
      Cookies.set("token", getToken)
    } else {
      Cookies.remove("token")
    }
  })
  return [token, setToken]
})()

const BASE_URL = "https://api.sso.ssug.top"

export { token, setToken }

async function waitIfFakerUnavailable() {
  while (!faker) {
    await new Promise((res) => {
      setTimeout(res, 0)
    })
  }
}

export async function fetchData<T>(
  url: string,
  body: object = {}
): Promise<{ ok: true; data: T } | { ok: false; detail: string }> {
  const headers: {
    Accept: string
    "Content-Type": string
    Authorization?: string
  } = {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
  if (import.meta.env.DEV)
    return {
      ok: false,
      detail: "function fetchData is unavailable in the development mode"
    }
  if (token()) {
    headers["Authorization"] = `Bearer ${token()}`
  }
  const result = await fetch(BASE_URL + url, {
    headers,
    body: JSON.stringify(body),
    method: "POST"
  })
  const response = await result.json()
  if (result.ok)
    return {
      ok: true,
      data: response
    }
  else
    return {
      ok: false,
      detail: response.detail
    }
}

function generateFakeToken() {
  return Array(128 / 4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 36 ** 4).toString(36))
    .join("")
}

export async function requestLogin(username: string, password: string) {
  if (import.meta.env.DEV) {
    setToken(generateFakeToken())
    return true
  }
  const data = await fetchData<{ token: string }>("/account/login", { username, password })
  if (!data.ok) return false
  setToken(data.data.token)
  return true
}

export async function requestLogout() {
  if (import.meta.env.DEV) {
    setToken(null)
    return
  }
  await fetchData("/account/logout")
  setToken(null)
}

export async function requestRegister({
  username,
  password,
  gender
}: {
  username: string
  password: string
  gender: "male" | "female" | "others"
}) {
  if (import.meta.env.DEV) {
    setToken(generateFakeToken())
    return true
  }
  const result = await fetchData<{ token: string }>("/account/register", {
    username,
    password,
    gender,
    preferred_languages: [],
    nickname: username
  })
  if (!result.ok) return false
  setToken(result.data.token)
  return true
}

export type PersonalInfoType = {
  gender: "male" | "female" | "others"
  create_time: number
  username: string
  nickname: string
  preferred_languages: string[]
  is_admin: boolean
  wx_id: string | null
}

export type ModifyPersonalInfoType = {
  gender: "male" | "female" | "others"
  nickname: string
  preferred_languages: string[]
}

function generateFakePersonalInfo() {
  return {
    gender: faker.helpers.arrayElement([
      "male",
      "female",
      "male",
      "female",
      "male",
      "female",
      "others"
    ] as const),
    create_time: +faker.date.recent(),
    username: faker.internet.displayName(),
    nickname: faker.internet.displayName(),
    preferred_languages: faker.helpers.arrayElements(
      ["C++", "Python", "JavaScript", "C", "Lisp", "Fortran", "Java", "Rust"],
      { min: 1, max: 2 }
    ),
    is_admin: Math.random() > 0.5,
    wx_id: null
  }
}

export async function getPersonalInfo(): Promise<PersonalInfoType | null> {
  if (import.meta.env.DEV) {
    await waitIfFakerUnavailable()
    return generateFakePersonalInfo()
  }
  const data = await fetchData<PersonalInfoType>("/account/get-info")
  if (!data.ok) {
    setToken(null)
  }
  return data.ok ? data.data : null
}

export type ExtendedPersonalInfoType = PersonalInfoType & { score: number }

export async function getAllInfo(): Promise<ExtendedPersonalInfoType[]> {
  if (import.meta.env.DEV) {
    await waitIfFakerUnavailable()
    return Array(Math.floor(Math.random() * 20) + 1)
      .fill(null)
      .map(() =>
        Object.assign(generateFakePersonalInfo(), {
          score: 1000 + Math.floor(Math.random() * 1000)
        })
      )
  }
  const data = await fetchData<ExtendedPersonalInfoType[]>("/account/get-all-info")
  return data.ok ? data.data : []
}

export async function modifyPersonalInfo(body: ModifyPersonalInfoType) {
  if (import.meta.env.DEV) return true
  const data = await fetchData<Record<string, never>>("/account/modify-info", body)
  if (!data.ok) {
    setToken(null)
  }
  return data.ok
}
export async function modifyOtherInfo(
  username: string,
  name: keyof ExtendedPersonalInfoType,
  value: unknown
) {
  if (import.meta.env.DEV) return true
  if (name == "preferred_languages") {
    value = (value as string).split(";").map((a) => a.trim())
  }
  if (name == "is_admin") {
    value = value == "Admin"
  }
  const data = await fetchData<Record<string, never>>("/account/modify-other-info", {
    [name]: value,
    username
  })
  return data.ok
}

export async function addScore(username: string, change: number, reason: string) {
  if (import.meta.env.DEV) return true
  const data = await fetchData<Record<string, never>>("/add-score", {
    change,
    username,
    reason
  })
  return data.ok
}

export function useCheckToken() {
  const navigate = useNavigate()
  function checkToken() {
    if (token() == null) {
      navigate("/login")
    }
  }
  createEffect(() => {
    checkToken()
  })
  return { checkToken }
}
