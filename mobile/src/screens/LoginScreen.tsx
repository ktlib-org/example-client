import AppInfo from "../components/AppInfo"
import Form from "../components/form/Form"
import Input from "../components/form/Input"
import LoginForm from "core/models/user/LoginForm"
import { useInitialEffect, useStore } from "core/react-utils"
import { observer } from "mobx-react-lite"
import { Button, View } from "native-base"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

const loginForm = new LoginForm()

const LoginScreen = observer(() => {
  useInitialEffect(loginForm.clearFormData)
  const { appStore } = useStore()
  const submit = () => appStore.login(loginForm)

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
  )
})

export default LoginScreen
