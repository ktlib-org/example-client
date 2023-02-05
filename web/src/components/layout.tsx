import classNames from "classnames";
import SideBar from "components/sidebar";
import UserMenu from "components/user-menu";
import { useInitialEffect } from "core/react-utils";
import { getCompactSidebar, setCompactSidebar } from "core/storage";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Icon from "./icon";

interface Props {
  children: JSX.Element | JSX.Element[];
  employee?: boolean;
}

const Layout = observer(({ children, employee }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useInitialEffect(async () => {
    setCompact(await getCompactSidebar());
  });

  const toggleCompact = () => {
    setCompactSidebar(!compact);
    setCompact(!compact);
  };

  return (
    <div>
      <SideBar
        employee={employee}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        compact={compact}
        toggleCompact={toggleCompact}
      />
      <div className={classNames("flex flex-col", compact ? "md:pl-14" : "md:pl-40")}>
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-10 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Icon name="Bars3BottomLeft" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex"></div>
            <div className="ml-4 flex items-center md:ml-6">
              <UserMenu />
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="mx-auto px-2 sm:px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
});

export default Layout;
