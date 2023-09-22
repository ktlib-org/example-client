import Layout from "../../components/Layout"
import { Route, Routes } from "react-router"
import EmployeeHomePage from "./EmployeeHomePage"
import OrganizationsPage from "./OrganizationsPage"
import UsersPage from "./UsersPage"

const Employee = () => (
  <Layout employee>
    <Routes>
      <Route path="" element={<EmployeeHomePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
    </Routes>
  </Layout>
)

export default Employee
