import { Box } from "native-base"
import { FormContext } from "core/react-utils"

interface Props {
  children: any
  form: any
}

const Form = ({ children, form }: Props) => (
  <Box w="100%">
    <FormContext.Provider value={form}>{children}</FormContext.Provider>
  </Box>
)

export default Form
