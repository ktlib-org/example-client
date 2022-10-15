import FormClass from "core/models/forms/form";
import { Box } from "native-base";
import { createContext } from "react";

interface Props {
  children: any;
  form: any;
}

export const FormContext = createContext(null as FormClass);

const Form = ({ children, form }: Props) => (
  <Box w="100%">
    <FormContext.Provider value={form}>{children}</FormContext.Provider>
  </Box>
);

export default Form;
