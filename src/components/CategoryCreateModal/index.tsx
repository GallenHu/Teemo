import { Input } from 'baseui/input';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { useState } from 'react';
import { FormControl } from 'baseui/form-control';
import IconSelector from '@/components/IconSelector';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (name: string, icon: string) => void;
}

export default function CategoryCreateModal(props: Props) {
  const { isOpen, onClose, onConfirm } = props;
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const close = () => {
    setName('');
    setIcon('');
    onClose && onClose();
  };
  const confirm = () => {
    if (!name || !icon) return;

    onConfirm && onConfirm(name, icon);
  };

  return (
    <Modal
      overrides={{
        Dialog: {
          style: {
            width: '500px',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
      onClose={close}
      isOpen={isOpen}
    >
      <ModalHeader>新增分类</ModalHeader>
      <ModalBody>
        <FormControl>
          <Input
            value={name}
            onChange={event => setName(event.currentTarget.value.trim())}
            placeholder="分类名称"
            maxLength={10}
          />
        </FormControl>
        <FormControl>
          <IconSelector selectedIcon={icon} onIconSelect={setIcon} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind="tertiary" onClick={close}>
          取消
        </ModalButton>
        <ModalButton onClick={confirm}>确定</ModalButton>
      </ModalFooter>
    </Modal>
  );
}
