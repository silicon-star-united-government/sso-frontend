import { createEffect, JSX, lazy } from "solid-js"
import { Router, Route, useNavigate } from "@solidjs/router"
import { Dialogs } from "./components/Dialog"
import Navbar from "./components/Navbar"

function WrapNavbar(props: { children?: JSX.Element }) {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  )
}

function RedirectToInfo() {
  const navigate = useNavigate()
  createEffect(() => {
    navigate("/info")
  })
  return null
}

function App() {
  return (
    <>
      <Router root={WrapNavbar}>
        <Route path="/" component={RedirectToInfo} />
        <Route path="/about" component={lazy(() => import("./pages/About"))} />
        <Route path="/login" component={lazy(() => import("./pages/Login"))} />
        <Route path="/register" component={lazy(() => import("./pages/Register"))} />
        <Route path="/info" component={lazy(() => import("./pages/PersonalInfo"))} />
        <Route path="/admin" component={lazy(() => import("./pages/Admin"))} />
      </Router>
      <Dialogs />
    </>
  )
}

export default App
