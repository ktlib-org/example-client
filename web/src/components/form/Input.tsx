import classNames from "classnames"
import { observer } from "mobx-react-lite"
import Field from "./Field"
import Icon, { Icons } from "../Icon"
import { useFormField } from "core/react-utils"
import { onEnterHandler } from "../../utils/web-utils"
import { forwardRef } from "react"
import Form from "core/models/Form"

interface Props {
  type?: string
  id?: string
  label?: string
  icon?: Icons
  placeholder?: string
  field: string
  onBlur?: () => any
  onEnter?: () => any
  form?: Form
}

const Input = observer(
  forwardRef<HTMLInputElement, Props>(
    ({ type, id, field, label, icon, placeholder, onBlur, onEnter, form }: Props, ref) => {
      const { value, hasErrors, errorText, onChange } = useFormField(field, form)

      return (
        <Field id={id} name={field} error={errorText} label={label}>
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {<Icon name={icon} />}
            </div>
          )}
          <input
            ref={ref}
            type={type || "text"}
            name={field}
            id={id}
            className={classNames(
              "shadow-sm block w-full sm:text-sm pr-10 rounded-md",
              !hasErrors && "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
              hasErrors &&
                "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500",
              icon && "pl-10",
            )}
            placeholder={placeholder}
            aria-invalid={hasErrors ? "true" : "false"}
            aria-describedby={`${id || field}-error`}
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            onKeyUp={onEnterHandler(onEnter)}
          />
        </Field>
      )
    },
  ),
)

export default Input
