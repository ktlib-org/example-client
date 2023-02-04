import { LoginIcon } from "@heroicons/react/outline";
import { KeyIcon, MailIcon } from "@heroicons/react/solid";
import Button from "components/button";
import ErrorMessage from "components/error-message";
import Form from "components/form/form";
import Input from "components/form/input";
import Spinner from "components/spinner";
import { LoginResult } from "core/api";
import EmailForm from "core/models/forms/email-form";
import LoginForm from "core/models/forms/login-form";
import SignupForm from "core/models/forms/signup-form";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Page from "./page";
import { useStore } from "core/react-utils";
import { AppStore } from "core/stores/app-store";

type Page = "login" | "forgot" | "signup" | "signupSuccess" | "forgotSuccess";

interface PageProps {
  change: (name: Page) => any;
}

const LoginPage = observer(() => {
  const [page, setPage] = useState("login" as Page);
  const { action } = useStore(AppStore).actionInfo || {};

  return (
    <Page name="login" title="Login">
      <div className="bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            {!action && page == "login" && <Login change={setPage} />}
            {!action && page == "forgot" && <Forgot change={setPage} />}
            {!action && page == "forgotSuccess" && <ForgotSuccess change={setPage} />}
            {!action && page == "signup" && <SignupPage change={setPage} />}
            {!action && page == "signupSuccess" && <SignupSuccess change={setPage} />}
            {action && <ActionPage />}
          </div>
        </div>
      </div>
    </Page>
  );
});

const loginForm = new LoginForm();

const Login = observer(({ change }: PageProps) => {
  const [loginResult, setLoginResult] = useState({} as LoginResult);
  const appStore = useStore(AppStore);

  const submit = async () => setLoginResult(await appStore.login(loginForm));

  const forgot = () => {
    forgotForm.updateField("email", loginForm.email);
    loginForm.clearFormData();
    change("forgot");
  };

  const signup = () => {
    loginForm.clearFormData();
    change("signup");
  };

  return (
    <div>
      <div className="w-80">
        <Form form={loginForm} submit={submit}>
          <Input type="email" label="Email" field="email" Icon={MailIcon} />
          <Input type="password" field="password" label="Password" Icon={KeyIcon} />
          <div className="my-8">
            <Button Icon={LoginIcon} text="Login" onClick={submit} submitting={loginForm.isSubmitting} />
          </div>
          {loginResult.loginFailed && <ErrorMessage text={loginResult.userLocked ? "User locked" : "Login failed"} />}
        </Form>
      </div>
      <div>
        <div className="float-left">
          <a onClick={forgot} className="text-blue-600 cursor-pointer">
            Forgot Password?
          </a>
        </div>
        <div className="float-right">
          <a onClick={signup} className="text-blue-600 cursor-pointer">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
});

const forgotForm = new EmailForm();

const Forgot = observer(({ change }: PageProps) => {
  const appStore = useStore(AppStore);

  const submit = async () => {
    await appStore.forgotPassword(forgotForm);
    change("forgotSuccess");
  };

  const back = () => {
    forgotForm.clearFormData();
    change("login");
  };

  return (
    <div>
      <Form form={forgotForm} submit={submit}>
        <h3>To reset your password, enter your email below</h3>
        <Input type="email" label="Email" field="email" Icon={MailIcon} />
        <div className="my-8">
          <Button Icon={LoginIcon} text="Submit" onClick={submit} submitting={forgotForm.isSubmitting} />
        </div>
      </Form>
      <div>
        <div className="float-left">
          <a onClick={back} className="text-blue-600 cursor-pointer">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
});

const ForgotSuccess = ({ change }: PageProps) => {
  const back = () => {
    forgotForm.clearFormData();
    change("login");
  };

  return (
    <div>
      <h3>We've sent an email to {forgotForm.email}, if an account exists for that email. Check your email.</h3>
      <div>
        <div className="float-left">
          <a onClick={back} className="text-blue-600 cursor-pointer">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

const signupForm = new SignupForm();

const SignupPage = observer(({ change }: PageProps) => {
  const appStore = useStore(AppStore);

  const submit = async () => {
    await appStore.signup(signupForm);
    change("signupSuccess");
  };

  const back = () => {
    signupForm.clearFormData();
    change("login");
  };

  return (
    <div>
      <Form form={signupForm} submit={submit}>
        <h3>Signup</h3>
        <Input label="First Name" field="firstName" />
        <Input label="Last Name" field="lastName" />
        <Input type="email" label="Email" field="email" />
        <div className="my-8">
          <Button Icon={LoginIcon} text="Submit" onClick={submit} submitting={signupForm.isSubmitting} />
        </div>
      </Form>
      <div>
        <div className="float-left">
          <a onClick={back} className="text-blue-600 cursor-pointer">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
});

const SignupSuccess = ({ change }: PageProps) => {
  const back = () => {
    signupForm.clearFormData();
    change("login");
  };

  return (
    <div>
      <h3>We've sent an email to {signupForm.email}. Check your email.</h3>
      <div>
        <div className="float-left">
          <a onClick={back} className="text-blue-600 cursor-pointer">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

const ActionPage = observer(() => {
  const {
    actionInfo: { action },
    actionInvalid,
  } = useStore(AppStore);

  const back = () => {
    window.location.href = "/";
  };

  const wording = action == "Accepting invitation..." ? "" : "Logging you in...";

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
          <Button text="Back to Login" onClick={back} />
        </div>
      )}
    </div>
  );
});

export default LoginPage;
