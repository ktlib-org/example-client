import Layout from "components/layout";
import Modals from "components/modals";
import { AppStore } from "core/stores";
import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./dashboard-page";
import Employee from "./employee";
import LoginPage from "./login-page";
import UsersPage from "./users-page";

const AppRoot = observer(() =>
  AppStore.currentUser ? (
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
);

export default AppRoot;
