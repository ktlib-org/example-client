import Layout from "components/layout";
import { Route, Routes } from "react-router";
import EmployeeHomePage from "./employee-home-page";
import OrganizationsPage from "./organizations-page";
import UsersPage from "./users-page";

const Employee = () => (
  <Layout employee>
    <Routes>
      <Route path="" element={<EmployeeHomePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
    </Routes>
  </Layout>
);

export default Employee;
