import { JSX, lazy } from "solid-js"
import { Router, Route } from "@solidjs/router"
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

function App() {
  return (
    <>
      <Router root={WrapNavbar}>
        <Route path="/" component={lazy(() => import("./pages/Home"))} />
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
