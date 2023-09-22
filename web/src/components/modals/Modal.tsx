import { Dialog, Transition } from "@headlessui/react"
import { EMPTY_FUNC } from "core/constants"
import { observer } from "mobx-react-lite"
import { Fragment, MutableRefObject } from "react"

interface Props {
  open: boolean
  title: string | JSX.Element
  description?: string | JSX.Element
  children: JSX.Element | JSX.Element[] | string
  buttons?: JSX.Element | JSX.Element[]
  initialFocus?: MutableRefObject<HTMLElement | null> | undefined
}

const Modal = observer(({ open, title, description, initialFocus, children, buttons }: Props) => {
  return (
    <Transition
      show={open}
      as={Fragment}
      enter="ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={EMPTY_FUNC} initialFocus={initialFocus}>
        <div className="min-h-screen px-4 text-center">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                  {description && <Dialog.Description>{description}</Dialog.Description>}
                  <div className="mt-3">{children}</div>
                </div>
              </div>
            </div>
            {buttons && (
              <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse space-x-2 sm:space-y-0 space-x-reverse">
                {buttons}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </Transition>
  )
})

export default Modal
