import { Dialog, Transition } from "@headlessui/react"
import classNames from "classnames"
import { APP_NAME } from "core/constants"
import { observer } from "mobx-react-lite"
import { Fragment } from "react"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { useStore } from "core/react-utils"
import Icon, { Icons } from "./Icon"

interface NavItem {
  name: string
  href: string
  icon: Icons
}

const userNavigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: "Home" },
  { name: "Users", href: "/users", icon: "Users" },
]

const employeeNavigation: NavItem[] = [
  { name: "Dashboard", href: "/employee", icon: "Home" },
  { name: "Organizations", href: "/employee/organizations", icon: "OfficeBuilding" },
  { name: "Users", href: "/employee/users", icon: "Users" },
]

interface Props {
  open: boolean
  setOpen: (value: boolean) => any
  compact: boolean
  toggleCompact: () => any
  employee?: boolean
}

const SideBar = observer(({ open, setOpen, compact, toggleCompact, employee }: Props) => {
  const location = useLocation()
  const nav = useNavigate()
  const { appStore } = useStore()

  let navigation = employee ? employeeNavigation : userNavigation

  if (!appStore.currentRole) {
    navigation = [navigation[0]]
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="text-white ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <Icon name="X" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4 text-white">{APP_NAME}</div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname == item.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      )}
                    >
                      <span
                        className={classNames(
                          location.pathname == item.href ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                          "mr-4 flex-shrink-0 h-6 w-6",
                        )}
                        aria-hidden="true"
                      >
                        <Icon name={item.icon} />
                      </span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={classNames("hidden md:flex md:flex-col md:fixed md:inset-y-0", compact ? "md:w-14" : "md:w-40")}>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex items-center h-10 flex-shrink-0 px-4 bg-gray-900 text-white">
            <Icon name="SquaresPlusSolid" onClick={() => nav("/")} />
            {!compact && <span className="pl-1 font-bold">{APP_NAME}</span>}
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname == item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  )}
                >
                  <span
                    className={classNames(
                      location.pathname == item.href ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-6 w-6",
                    )}
                    aria-hidden="true"
                  >
                    <Icon name={item.icon} />
                  </span>
                  {!compact && item.name}
                </Link>
              ))}
            </nav>
            <div className="pr-2 pl-3 py-2 text-md text-white flex flex-row space-x-1 items-center">
              {!compact && (
                <>
                  <div className="flex-1 text-right">Collapse</div>
                  <Icon name="ArrowLeftCircleSolid" onClick={toggleCompact} />
                </>
              )}
              {compact && <Icon name="ArrowRightCircleSolid" onClick={toggleCompact} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default SideBar
