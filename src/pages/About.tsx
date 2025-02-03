import { useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"

export default function About() {
  const navigate = useNavigate()
  createEffect(() => {
    location.href = "//ssug.top"
  })
  return (
    <div class="hero bg-base-200 flex-1">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
          <button
            class="btn btn-primary"
            onClick={() => {
              navigate("/info")
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
