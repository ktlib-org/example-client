import { isString } from "radash"
import { observer } from "mobx-react-lite"
import Select from "react-select"
import CreateSelect from "react-select/creatable"
import classNames from "classnames"
import React from "react"

export interface Option {
  value: string
  label: string
  id?: string
  disabled?: boolean
  isSelected?: boolean
}

export interface GroupOption {
  label: string
  options: Option[]
}

interface Props {
  hasError?: boolean
  options: Option[] | string[] | GroupOption[]
  onChange: (value: any) => any
  value: string
  placeholder?: string
  isClearable?: boolean
  isDisabled?: boolean
  isSearchable?: boolean
  onCreate?: (value: string) => any
  formatCreateLabel?: (value: string) => string | React.ReactNode
}

const SelectInput = observer(
  ({
    value,
    onChange,
    options,
    placeholder,
    isClearable,
    isSearchable,
    isDisabled,
    onCreate,
    hasError,
    formatCreateLabel,
  }: Props) => {
    let allOptions: Array<Option | GroupOption> = options as Array<Option | GroupOption>

    if (options.length > 0 && isString(options[0])) {
      allOptions = options.map((o) => {
        return { value: o, label: o } as Option
      })
    }

    let optionList: Option[] = allOptions as Option[]

    if (allOptions.length > 0 && (allOptions[0] as any).options) {
      optionList = (allOptions as any).flatMap((o) => o.options)
    }

    const option = optionList.find((o) => o.value == value) || null

    const change = (opt: Option) => {
      onChange(opt?.id || opt?.value)
    }

    const Control = onCreate ? CreateSelect : Select

    return (
      <div className="mt-1">
        <Control
          className="react-select-container"
          classNamePrefix="react-select"
          classNames={{
            control: () => classNames("focus-within:ring py-0.5 w-full sm:text-sm", hasError && "error"),
          }}
          value={option}
          onChange={change}
          placeholder={placeholder}
          options={allOptions}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isSearchable={isSearchable || false}
          onCreateOption={onCreate}
          formatCreateLabel={formatCreateLabel}
        />
      </div>
    )
  },
)

export default SelectInput
