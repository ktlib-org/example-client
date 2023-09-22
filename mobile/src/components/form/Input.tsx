import { observer } from "mobx-react-lite"
import { FormControl, IInputProps, Input as NBInput, Stack } from "native-base"
import { useFormField } from "core/react-utils"

interface Props extends IInputProps {
  field: string
  label?: string
  helperText?: string
}

const Input = observer((props: Props) => {
  const { value, hasErrors, errorText, onChange } = useFormField(props.field)

  return (
    <FormControl isRequired={props.isRequired} isInvalid={hasErrors}>
      <Stack mx="4">
        {props.label && <FormControl.Label>{props.label}</FormControl.Label>}
        <NBInput {...props} value={value?.toString() || ""} onChangeText={onChange} />
        {props.helperText && <FormControl.HelperText>{props.helperText}</FormControl.HelperText>}
        {hasErrors && (
          <FormControl.ErrorMessage
            _text={{
              fontSize: "xs",
            }}
          >
            {errorText}
          </FormControl.ErrorMessage>
        )}
      </Stack>
    </FormControl>
  )
})

export default Input
