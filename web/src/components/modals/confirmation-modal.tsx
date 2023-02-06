import Button from "components/button";
import { observer } from "mobx-react-lite";
import Modal from "./modal";
import AppStore from "core/stores/app-store";
import { useStore } from "core/react-utils";

const ConfirmationModal = observer(() => {
  const { confirmation } = useStore(AppStore);

  return (
    <Modal
      open={confirmation.open}
      title={confirmation.state.header}
      buttons={[
        <Button
          key={1}
          color={confirmation.state.okColor || "blue"}
          onClick={() => confirmation.hide(true)}
          text={confirmation.state.okText || "OK"}
          icon="Check"
        />,
        <Button
          key={0}
          color={confirmation.state.cancelColor || "gray"}
          onClick={() => confirmation.hide(false)}
          text={confirmation.state.cancelText || "Cancel"}
          icon="X"
        />,
      ]}
    >
      {confirmation.state.message}
    </Modal>
  );
});

export default ConfirmationModal;
