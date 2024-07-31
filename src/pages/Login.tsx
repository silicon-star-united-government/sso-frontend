import { createSignal } from "solid-js"
import { createDialog } from "../components/Dialog"
import { A, useLocation, useNavigate, useSearchParams } from "@solidjs/router"
import { requestLogin } from "../network"

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
          <h1 class="text-5xl font-bold">Login now!</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
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
                    title: "Login failure",
                    body: "Your username or password is incorrect."
                  })
                }
              })
            }}
          >
            <div class="form-control">
              <label class="label">
                <span class="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
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
                <span class="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
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
                      title: "Not Implemented",
                      body: "Please contact the administrator in order to recover the access to your account."
                    })
                  }}
                >
                  Forgot password?
                </a>
              </label>
            </div>
            <div class="form-control mt-6 join flex flex-row">
              <A class="btn btn-secondary join-item" href={`/register${location.search}`}>
                Register
              </A>
              <button
                class="btn btn-primary join-item flex-1"
                disabled={!username() || !password()}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
