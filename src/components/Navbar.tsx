import { A } from "@solidjs/router"
import { createResource, Show } from "solid-js"
import { getPersonalInfo, token } from "../network"

export function Username() {
  const [personalInfo] = createResource(getPersonalInfo)

  return <Show when={personalInfo()}>{personalInfo()!.username}</Show>
}

export default function Navbar() {
  return (
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-square md:hidden h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <A href="/" activeClass="active" end>
                Home
              </A>
            </li>
            <li>
              <A href="/about" activeClass="active" end>
                About
              </A>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost text-xl">Demo</a>
      </div>
      <div class="navbar-center hidden md:flex">
        <ul class="menu menu-horizontal px-1 flex gap-1">
          <li>
            <A href="/" activeClass="active" end>
              Home
            </A>
          </li>
          <li>
            <A href="/about" activeClass="active" end>
              About
            </A>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <Show when={token()}>
          <A class="btn" href="/info">
            <Username />
          </A>
        </Show>
        <Show when={!token()}>
          <A class="btn" href="/login">
            Login
          </A>
        </Show>
      </div>
    </div>
  )
}
