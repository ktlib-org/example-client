import Layout from "../components/Layout"
import Modals from "components/modals"
import { observer } from "mobx-react-lite"
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import DashboardPage from "./DashboardPage"
import Employee from "./employee"
import LoginPage from "./LoginPage"
import UsersPage from "./UsersPage"
import { useStore } from "core/react-utils"

const AppRoot = observer(() =>
  useStore().appStore.currentUser ? (
    <BrowserRouter>
      <Routes>
        <Route path="/employee/*" element={<Employee />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
      <Modals />
    </BrowserRouter>
  ) : (
    <LoginPage />
  ),
)

export default AppRoot
