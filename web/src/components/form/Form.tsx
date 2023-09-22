import { FormContext } from "core/react-utils"

interface Props {
  children: any
  form: any
}

const Form = ({ children, form }: Props) => (
  <form className="space-y-2">
    <FormContext.Provider value={form}>{children}</FormContext.Provider>
  </form>
)

export default Form
