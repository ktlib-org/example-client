import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { useNavigate } from "react-router";
import { useStore } from "core/react-utils";
import AppStore from "core/stores/app-store";
import { userProfileModalState } from "./modals/user-profile-modal";
import { updatePasswordModalState } from "./modals/update-password-modal";
import Icon from "./icon";

const UserMenu = observer(() => {
  const { isEmployee, logout } = useStore(AppStore);
  const navigate = useNavigate();

  const userNavigation = [
    { name: "Your Profile", onClick: userProfileModalState.show },
    { name: "Update Password", onClick: updatePasswordModalState.show },
    { name: "Sign out", href: null, onClick: logout },
  ];

  const navToShow = [...userNavigation];

  if (isEmployee) {
    const i = userNavigation.length - 1;
    const last = userNavigation[i];
    navToShow[i] = { name: "Employee Portal", onClick: () => navigate("/employee") };
    navToShow.push(last);
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">Open user menu</span>
          <Icon name="UserCircle" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {navToShow.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  onClick={() => item.onClick()}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700 cursor-pointer",
                  )}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

export default UserMenu;
