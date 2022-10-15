import classNames from "classnames";
import Form from "core/models/forms/form";
import { isString } from "lodash";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import Field from "./field";
import { FormContext } from "./form";

interface Option {
  value: string;
  display: string;
}

interface Props {
  id?: string;
  label?: string;
  field: string;
  onBlur?: () => any;
  options: Option[] | string[];
}

const Select = observer(({ id, field, label, onBlur, options }: Props) => {
  const form = useContext(FormContext);
  form.validField(field);
  const f = field as keyof Form;
  const hasError = form.hasErrors(f);

  let allOptions: Option[] = [];

  if (options.length > 0 && isString(options[0])) {
    allOptions = options.map((o) => {
      return { value: o, display: o } as Option;
    });
  }

  return (
    <Field id={id} name={field} error={form.errorText(f)} label={label}>
      <select
        id={id}
        name={field}
        className={classNames(
          !hasError && "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
          hasError &&
            "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500",
          "mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md",
        )}
        onBlur={onBlur}
        value={field[f]}
        onChange={form.onChange(f)}
      >
        {allOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.display}
          </option>
        ))}
      </select>
    </Field>
  );
});

export default Select;
