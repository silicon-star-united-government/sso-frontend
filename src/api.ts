import { token, setToken } from "./auth"

const BASE_URL = "https://api.sso.ssug.top"

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
  if (token()) {
    headers["Authorization"] = `Bearer ${token()}`
  }
  let result: Response
  try {
    result = await fetch(BASE_URL + url, {
      headers,
      body: JSON.stringify(body),
      method: "POST"
    })
  } catch (e) {
    return {
      ok: false,
      detail: (e as Error).message
    }
  }
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

export async function requestLogin(username: string, password: string) {
  const data = await fetchData<{ token: string }>("/account/login", { username, password })
  if (!data.ok) return false
  setToken(data.data.token)
  return true
}

export async function requestLogout() {
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

export async function getPersonalInfo(): Promise<PersonalInfoType | null> {
  const data = await fetchData<PersonalInfoType>("/account/get-info")
  if (!data.ok) {
    setToken(null)
  }
  return data.ok ? data.data : null
}

export type ExtendedPersonalInfoType = PersonalInfoType & { score: number }

export async function getAllInfo(): Promise<ExtendedPersonalInfoType[]> {
  const data = await fetchData<ExtendedPersonalInfoType[]>("/account/get-all-info")
  return data.ok ? data.data : []
}

export async function modifyPersonalInfo(body: ModifyPersonalInfoType) {
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
  const data = await fetchData<Record<string, never>>("/add-score", {
    change,
    username,
    reason
  })
  return data.ok
}
