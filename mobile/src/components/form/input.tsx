import Form from "core/models/forms/form";
import { observer } from "mobx-react-lite";
import { FormControl, IInputProps, Input as NBInput, Stack } from "native-base";
import { useContext } from "react";
import { FormContext } from "./form";

interface Props extends IInputProps {
  field: string;
  label?: string;
  helperText?: string;
}

FormControl;

const Input = observer((props: Props) => {
  const form = useContext(FormContext);
  form.validField(props.field);
  const f = props.field as keyof Form;
  const hasError = form.hasErrors(f);

  return (
    <FormControl isRequired={props.isRequired} isInvalid={hasError}>
      <Stack mx="4">
        {props.label && <FormControl.Label>{props.label}</FormControl.Label>}
        <NBInput {...props} value={form[f]?.toString() || ""} onChangeText={form.onChange(f)} />
        {props.helperText && <FormControl.HelperText>{props.helperText}</FormControl.HelperText>}
        {hasError && (
          <FormControl.ErrorMessage
            _text={{
              fontSize: "xs",
            }}
          >
            {form.errorText(f)}
          </FormControl.ErrorMessage>
        )}
      </Stack>
    </FormControl>
  );
});

export default Input;
