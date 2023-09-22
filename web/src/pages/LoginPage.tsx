import Button from "../components/Button"
import ErrorMessage from "../components/ErrorMessage"
import Spinner from "../components/Spinner"
import EmailForm from "core/models/EmailForm"
import LoginForm from "core/models/user/LoginForm"
import SignupForm from "core/models/user/SignupForm"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import Page from "./Page"
import { useStore } from "core/react-utils"
import Icon from "../components/Icon"
import LoginResult from "core/models/user/LoginResult"
import Form from "../components/form/Form"
import Input from "../components/form/Input"

type Page = "login" | "forgot" | "signup" | "signupSuccess" | "forgotSuccess"

interface PageProps {
  change: (name: Page) => any
}

const LoginPage = observer(() => {
  const [page, setPage] = useState("login" as Page)
  const { action } = useStore().appStore.actionInfo || {}

  return (
    <Page name="login" title="Login">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          {!action && page == "login" && <Login change={setPage} />}
          {!action && page == "forgot" && <Forgot change={setPage} />}
          {!action && page == "forgotSuccess" && <ForgotSuccess change={setPage} />}
          {!action && page == "signup" && <SignupPage change={setPage} />}
          {!action && page == "signupSuccess" && <SignupSuccess change={setPage} />}
          {action && <ActionPage />}
        </div>
      </div>
    </Page>
  )
})

const loginForm = new LoginForm()

const Login = observer(({ change }: PageProps) => {
  const [loginResult, setLoginResult] = useState({} as LoginResult)
  const { appStore } = useStore()

  const submit = async () => setLoginResult(await appStore.login(loginForm))

  const forgot = () => {
    forgotForm.updateField("email", loginForm.email)
    loginForm.clearFormData()
    change("forgot")
  }

  const signup = () => {
    loginForm.clearFormData()
    change("signup")
  }

  return (
    <>
      <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Login To Your Account</div>
      <button className="relative mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
        <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500">
          <Icon name="Google" />
        </span>
        <span>Login with Google</span>
      </button>
      <div className="relative mt-10 h-px bg-gray-300">
        <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
          <span className="bg-white px-4 text-xs text-gray-500 uppercase">Or Login With Email</span>
        </div>
      </div>
      <div className="mt-10">
        <Form form={loginForm}>
          <div className="flex flex-col mb-6">
            <Input type="email" label="Email" field="email" icon="At" onEnter={submit} />
          </div>
          <div className="flex flex-col mb-6">
            <Input type="password" field="password" label="Password" icon="Padlock" onEnter={submit} />
          </div>

          <div className="flex items-center mb-6 -mt-4">
            <div className="flex ml-auto">
              <a
                onClick={forgot}
                className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Forgot Your Password?
              </a>
            </div>
          </div>

          <div className="flex w-full">
            <Button text="Login" icon="ArrowRightOnSquare" onClick={submit} />
          </div>
          {loginResult.loginFailed && <ErrorMessage text={loginResult.userLocked ? "User locked" : "Login failed"} />}
        </Form>
      </div>
      <div className="flex justify-center items-center mt-6">
        <a
          onClick={signup}
          className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center cursor-pointer"
        >
          <span>
            <Icon name="UserPlus" />
          </span>
          <span className="ml-2">You don't have an account?</span>
        </a>
      </div>
    </>
  )
})

const forgotForm = new EmailForm()

const Forgot = observer(({ change }: PageProps) => {
  const { appStore } = useStore()

  const submit = async () => {
    await appStore.forgotPassword(forgotForm)
    change("forgotSuccess")
  }

  const back = () => {
    forgotForm.clearFormData()
    change("login")
  }

  return (
    <div>
      <Form form={forgotForm}>
        <h3>To reset your password, enter your email below</h3>
        <Input type="email" label="Email" field="email" icon="At" onEnter={submit} />
        <div className="my-8">
          <Button icon="ArrowRightOnSquare" text="Submit" onClick={submit} submitting={forgotForm.isSubmitting} />
          <Button icon="ArrowLeftCircle" className="mt-16" text="Back to Login" onClick={back} />
        </div>
      </Form>
    </div>
  )
})

const ForgotSuccess = ({ change }: PageProps) => {
  const back = () => {
    forgotForm.clearFormData()
    change("login")
  }

  return (
    <div>
      <h3>We've sent an email to {forgotForm.email}, if an account exists for that email. Check your email.</h3>
      <div>
        <Button icon="ArrowLeftCircle" className="mt-16" text="Back to Login" onClick={back} />
      </div>
    </div>
  )
}

const signupForm = new SignupForm()

const SignupPage = observer(({ change }: PageProps) => {
  const { appStore } = useStore()

  const submit = async () => {
    await appStore.signup(signupForm)
    change("signupSuccess")
  }

  const back = () => {
    signupForm.clearFormData()
    change("login")
  }

  return (
    <Form form={signupForm}>
      <h3>Signup</h3>
      <Input label="First Name" field="firstName" onEnter={submit} />
      <Input label="Last Name" field="lastName" onEnter={submit} />
      <Input type="email" label="Email" field="email" onEnter={submit} />
      <div className="my-8">
        <Button icon="ArrowRightOnSquare" text="Submit" onClick={submit} submitting={signupForm.isSubmitting} />
        <Button icon="ArrowLeftCircle" className="mt-16" text="Back to Login" onClick={back} />
      </div>
    </Form>
  )
})

const SignupSuccess = ({ change }: PageProps) => {
  const back = () => {
    signupForm.clearFormData()
    change("login")
  }

  return (
    <div>
      <h3>We've sent an email to {signupForm.email}. Check your email.</h3>
      <div>
        <Button icon="ArrowLeftCircle" className="mt-16" text="Back to Login" onClick={back} />
      </div>
    </div>
  )
}

const ActionPage = observer(() => {
  const {
    appStore: {
      actionInfo: { action },
      actionInvalid,
    },
  } = useStore()

  const back = () => {
    window.location.href = "/"
  }

  const wording = action == "Accepting invitation..." ? "" : "Logging you in..."

  return (
    <div className="w-full">
      {!actionInvalid && (
        <div className="flex flex-row text-xl">
          <div className="h-6 mr-2">
            <Spinner />
          </div>
          {wording}
        </div>
      )}
      {actionInvalid && (
        <div>
          <div className="text-xl mb-8">Invalid token</div>
          <Button icon="ArrowLeftCircle" className="mt-16" text="Back to Login" onClick={back} />
        </div>
      )}
    </div>
  )
})

export default LoginPage
