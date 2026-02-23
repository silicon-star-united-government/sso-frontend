import { useNavigate } from "@solidjs/router"
import { createEffect, createSignal, Signal } from "solid-js"
import CookiesDefault from "js-cookie"

const Cookies = CookiesDefault.withAttributes({
  domain: location.hostname == "sso.ssug.top" ? "ssug.top" : location.hostname,
  sameSite: "strict",
  expires: new Date("9999-12-29 23:59:59")
  // secure: true
})

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

export { token, setToken }

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
