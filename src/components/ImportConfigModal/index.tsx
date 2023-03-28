import { FileUploader } from 'baseui/file-uploader';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onFileUploaded?: (file: File) => void;
}

export default function ImportConfigModal(props: Props) {
  const { isOpen, onClose, onFileUploaded } = props;
  const [progressAmount, setProgressAmount] = useState(0);

  const close = () => {
    setProgressAmount(0);
    onClose && onClose();
  };

  const onCancelUpload = () => {};
  const onUploadStart = (acceptedFiles: File[], rejectedFiles: File[]) => {
    if (acceptedFiles.length) {
      onFileUploaded && onFileUploaded(acceptedFiles[0]);
    }
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
      <ModalHeader>导入配置</ModalHeader>
      <ModalBody className="import-config-modal-body">
        <FileUploader
          multiple={false}
          accept=".json"
          onCancel={onCancelUpload}
          onDrop={(acceptedFiles, rejectedFiles) => {
            onUploadStart(acceptedFiles, rejectedFiles);
          }}
          progressAmount={progressAmount}
          progressMessage={progressAmount ? `Uploading... ${progressAmount}% of 100%` : ''}
        />
      </ModalBody>
    </Modal>
  );
}
