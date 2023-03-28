import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { Button } from 'baseui/button';

const useConfirm = (
  onConfirm = () => {},
  onCancel = () => {}
): [(msg: string) => void, () => void, () => JSX.Element, (submitting: boolean) => void] => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOk = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
    setVisible(false);
  };

  function showConfirm(msg: string) {
    setVisible(true);
    setMessage(msg);
  }

  function hideConfirm() {
    setVisible(false);
  }

  function changeSubmitting(val: boolean) {
    setSubmitting(val);
  }

  const ConfirmModal = () => {
    return (
      <Modal onClose={handleCancel} isOpen={visible}>
        <ModalHeader>Confirm</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <ModalButton kind="tertiary" onClick={handleCancel}>
            Cancel
          </ModalButton>
          <Button onClick={handleOk} isLoading={submitting}>
            Okay
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return [showConfirm, hideConfirm, ConfirmModal, changeSubmitting];
};

export default useConfirm;
