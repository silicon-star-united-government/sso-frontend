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
          <h1 class="text-5xl font-bold">About SSO System</h1>
          <p class="py-6">Providing secure and seamless access to all your applications.</p>
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
