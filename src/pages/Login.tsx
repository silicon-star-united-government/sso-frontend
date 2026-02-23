import { createSignal } from "solid-js"
import { createDialog } from "../components/Dialog"
import { A, useLocation, useNavigate, useSearchParams } from "@solidjs/router"
import { requestLogin } from "../api"
import { t } from "../i18n"

export default function Login() {
  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  return (
    <div class="hero bg-base-200 flex-1">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">{t("welcome_back")}</h1>
          <p class="py-6">
            {t("login_desc")}
          </p>
        </div>
        <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form
            class="card-body"
            onSubmit={(ev) => {
              ev.preventDefault()
              if (!username() || !password()) return
              requestLogin(username(), password()).then((value) => {
                if (value) {
                  if (searchParams["redirect_uri"]) {
                    window.location.href = searchParams["redirect_uri"]
                  } else {
                    navigate("/info")
                  }
                } else {
                  createDialog({
                    title: t("login_failure"),
                    body: t("login_failure_desc")
                  })
                }
              })
            }}
          >
            <div class="form-control">
              <label class="label">
                <span class="label-text">{t("username")}</span>
              </label>
              <input
                type="text"
                placeholder={t("username")}
                class="input input-bordered"
                required
                value={username()}
                onInput={(ev) => {
                  setUsername(ev.target.value)
                }}
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">{t("password")}</span>
              </label>
              <input
                type="password"
                placeholder={t("password")}
                class="input input-bordered"
                required
                value={password()}
                onInput={(ev) => {
                  setPassword(ev.target.value)
                }}
              />
              <label class="label">
                <a
                  href="#"
                  class="label-text-alt link link-hover"
                  onClick={() => {
                    createDialog({
                      title: t("not_implemented"),
                      body: t("not_implemented_desc")
                    })
                  }}
                >
                  {t("forgot_password")}
                </a>
              </label>
            </div>
            <div class="form-control mt-6 join flex flex-row">
              <A class="btn btn-secondary join-item" href={`/register${location.search}`}>
                {t("register")}
              </A>
              <button
                class="btn btn-primary join-item flex-1"
                disabled={!username() || !password()}
              >
                {t("login")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
