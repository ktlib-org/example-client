import Form from "core/models/Form"
import { observer } from "mobx-react-lite"
import React from "react"
import SelectInput, { GroupOption, Option } from "./SelectInput"
import Field from "./Field"
import { useFormField } from "core/react-utils"

interface Props {
  id?: string
  label?: string
  field: string
  onBlur?: () => any
  options: Option[] | string[] | GroupOption[]
  placeholder?: string
  isClearable?: boolean
  isDisabled?: boolean
  isSearchable?: boolean
  onCreate?: (value: string) => any
  formatCreateLabel?: (value: string) => string | React.ReactNode
  form?: Form
}

const Select = observer(
  ({
    id,
    field,
    label,
    options,
    placeholder,
    isClearable,
    isSearchable,
    isDisabled,
    onCreate,
    formatCreateLabel,
    form,
  }: Props) => {
    const { value, hasErrors, errorText, onChange } = useFormField(field, form)

    return (
      <Field id={id} name={field} error={errorText} label={label}>
        <SelectInput
          options={options}
          onChange={onChange}
          value={value?.toString()}
          hasError={hasErrors}
          placeholder={placeholder}
          isClearable={isClearable}
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          onCreate={onCreate}
          formatCreateLabel={formatCreateLabel}
        />
      </Field>
    )
  },
)

export default Select
