import Button from "components/button";
import { SystemService } from "core/api";
import { API_URL } from "core/constants";
import ENVIRONMENT from "core/environment";
import { useInitialEffect, useStore } from "core/react-utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router";
import Page from "./page";
import AppStore from "core/stores/app-store";
import { organizationModalState } from "../components/modals/organization-modal";

const DashboardPage = observer(() => {
  const [serverVersion, setServerVersion] = useState(null);
  const nav = useNavigate();
  const appStore = useStore(AppStore);

  useInitialEffect(async () => {
    if (appStore.actionInfo?.action) {
      nav("/", { replace: true });
    }
    const result = await SystemService.status();
    setServerVersion(result.version);
  });

  return (
    <Page name="dashboard" title="Dashboard">
      <div className="pt-6 space-y-4">
        <blockquote>
          <p className="text-lg font-semibold">My App Rocks</p>
        </blockquote>
        <figcaption className="font-medium">
          <div>Client Version: {(window as any).buildTime}</div>
          <div>Server Version: {serverVersion}</div>
          <div>Environment: {ENVIRONMENT}</div>
          <div>API URL: {API_URL}</div>
        </figcaption>
      </div>

      {!appStore.currentRole && (
        <div className="mt-10">
          <p className="text-lg font-semibold mb-3">You aren't in any organizations, you can:</p>
          <ul className="list-disc list-inside">
            <li>Ask an organization admin to invite you</li>
            <li>
              Create your own organization by clicking here:{" "}
              <Button text="Create Organization" color="green" onClick={organizationModalState.show} />
            </li>
          </ul>
        </div>
      )}
    </Page>
  );
});

export default DashboardPage;
