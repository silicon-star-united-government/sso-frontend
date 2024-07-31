import { A, useNavigate } from "@solidjs/router"
import { createSignal } from "solid-js"
import { requestRegister } from "../network"
import { createDialog } from "../components/Dialog"

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [gender, setGender] = createSignal<"male" | "female" | "others">("male")
  return (
    <div class="hero bg-base-200 flex-1">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Register now!</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form
            class="card-body"
            onSubmit={() => {
              if (!username() || !password()) return
              requestRegister({
                username: username(),
                password: password(),
                gender: gender()
              }).then((ok) => {
                if (ok) {
                  navigate("/info")
                } else {
                  createDialog({
                    title: "Registration Failure",
                    body: "Consider change a username and try again?"
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
            </div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Your gender</span>
              </div>
              <select
                class="select select-bordered"
                value={gender()}
                onChange={(ev) =>
                  setGender(ev.currentTarget.value as unknown as "male" | "female" | "others")
                }
              >
                <option class="capitalize">male</option>
                <option class="capitalize">female</option>
                <option class="capitalize">others</option>
              </select>
            </label>
            <div class="form-control mt-6 join flex flex-row">
              <A class="btn btn-secondary join-item" href="/login">
                Login
              </A>
              <button
                class="btn btn-primary join-item flex-1"
                disabled={!username() || !password()}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
