import { useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"
import { t } from "../i18n"

export default function About() {
  const navigate = useNavigate()
  createEffect(() => {
    location.href = "//ssug.top"
  })
  return (
    <div class="hero bg-base-200 flex-1">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">{t("about_sso")}</h1>
          <p class="py-6">{t("about_desc")}</p>
          <button
            class="btn btn-primary"
            onClick={() => {
              navigate("/info")
            }}
          >
            {t("get_started")}
          </button>
        </div>
      </div>
    </div>
  )
}
