import { CheckIcon, XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import { ModalStore } from "core/stores";
import { observer } from "mobx-react-lite";
import Modal from "./modal";

const state = ModalStore.confirmation;

const ConfirmationModal = observer(() => {
  return (
    <Modal
      open={state.open}
      title={state.state.header}
      buttons={[
        <Button
          key={1}
          color={state.state.okColor || "blue"}
          onClick={() => state.hide(true)}
          text={state.state.okText || "OK"}
          Icon={CheckIcon}
        />,
        <Button
          key={0}
          color={state.state.cancelColor || "gray"}
          onClick={() => state.hide(false)}
          text={state.state.cancelText || "Cancel"}
          Icon={XIcon}
        />,
      ]}
    >
      {state.state.message}
    </Modal>
  );
});

export default ConfirmationModal;
