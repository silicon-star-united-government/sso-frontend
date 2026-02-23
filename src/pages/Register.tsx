import { A, useLocation, useNavigate, useSearchParams } from "@solidjs/router"
import { createSignal } from "solid-js"
import { requestRegister } from "../api"
import { createDialog } from "../components/Dialog"

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [gender, setGender] = createSignal<"male" | "female" | "others">("male")
  const [searchParams] = useSearchParams()
  const location = useLocation()
  return (
    <div class="hero bg-base-200 flex-1">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Create an Account!</h1>
          <p class="py-6">
            Join us today. Create an account to participate in the community, manage your profile,
            and discover more.
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
                  if (searchParams["redirect_uri"]) {
                    window.location.href = searchParams["redirect_uri"]
                  } else {
                    navigate("/info")
                  }
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
            <div class="form-control">
              <label class="label">
                <span class="label-text">Your gender</span>
              </label>
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
            </div>
            <div class="form-control mt-6 join flex flex-row">
              <A class="btn btn-secondary join-item" href={`/login${location.search}`}>
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
