import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { AppStore, ModalStore } from "core/stores";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { useNavigate } from "react-router";

const userNavigation = [
  { name: "Your Profile", onClick: ModalStore.userProfile.show },
  { name: "Update Password", onClick: ModalStore.updatePassword.show },
  { name: "Sign out", href: null, onClick: AppStore.logout },
];

const UserMenu = observer(() => {
  const { isEmployee } = AppStore;
  const navigate = useNavigate();
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
          <UserCircleIcon className="w-7 h-7" />
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
