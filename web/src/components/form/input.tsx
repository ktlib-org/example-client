import classNames from "classnames";
import Form from "core/models/forms/form";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import Field from "./field";
import { FormContext } from "./form";

interface Props {
  type?: string;
  id?: string;
  label?: string;
  Icon?: React.ElementType;
  placeholder?: string;
  field: string;
  onBlur?: () => any;
}

const Input = observer(({ type, id, field, label, Icon, placeholder, onBlur }: Props) => {
  const form = useContext(FormContext);
  form.validField(field);
  const f = field as keyof Form;
  const hasError = form.hasErrors(f);

  return (
    <Field id={id} name={field} error={form.errorText(f)} label={label}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {<Icon className="h-5 w-5" />}
        </div>
      )}
      <input
        type={type || "text"}
        name={field}
        id={id}
        className={classNames(
          "shadow-sm block w-full sm:text-sm pr-10 rounded-md",
          !hasError && "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
          hasError &&
            "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500",
          Icon && "pl-10",
        )}
        placeholder={placeholder}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={`${id || field}-error`}
        onChange={form.onChange(f)}
        value={form[field]}
        onBlur={onBlur}
      />
    </Field>
  );
});

export default Input;
