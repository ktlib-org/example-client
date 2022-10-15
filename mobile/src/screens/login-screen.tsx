import AppInfo from "components/app-info";
import Form from "components/form/form";
import Input from "components/form/input";
import LoginForm from "core/models/forms/login-form";
import { useInitialEffect } from "core/react-utils";
import { AppStore } from "core/stores";
import { observer } from "mobx-react-lite";
import { Button, View } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const loginForm = new LoginForm();

const LoginScreen = observer(() => {
  useInitialEffect(loginForm.clearFormData);
  const submit = () => AppStore.login(loginForm);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AppInfo />
        <Form form={loginForm}>
          <Input isRequired label="Email" placeholder="Email" field="email" />
          <Input type="password" placeholder="Password" field="password" />
        </Form>
        <Button onPress={submit}>Login</Button>
      </View>
    </KeyboardAwareScrollView>
  );
});

export default LoginScreen;
