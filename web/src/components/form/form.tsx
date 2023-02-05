import FormClass from "core/models/forms/form";
import { createContext } from "react";

interface Props {
  children: any;
  form: any;
  submit: () => any;
}

export const FormContext = createContext(null as FormClass);

const Form = ({ children, form, submit }: Props) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      submit();
    }}
    className="space-y-2"
    onKeyUp={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    }}
  >
    <FormContext.Provider value={form}>{children}</FormContext.Provider>
  </form>
);

export default Form;
