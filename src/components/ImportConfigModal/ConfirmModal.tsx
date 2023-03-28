import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { useEffect, useState } from 'react';
import useGlobalValue from '@/hooks/useGlobalState';
import FileUtils from '@/utils/file';
import Configuration from '@/utils/configuration';
import TimeUtils from '@/utils/time';
import { toaster } from 'baseui/toast';

interface Props {
  isOpen: boolean;
  file: File | null;
  onClose?: () => void;
}

export default function CategoryCreateModal(props: Props) {
  const { isOpen, file, onClose } = props;
  const [confInfo, setConfInfo] = useState('');
  const [importingConfiguration, setImportingConfiguration] = useState<Configuration | null>(null);
  const [globalValue, setGlobalValue] = useGlobalValue();
  const { configuration } = globalValue;

  const close = () => {
    onClose && onClose();
  };
  const confirm = () => {
    if (importingConfiguration) {
      const newConf = configuration.applyConfiguration(importingConfiguration);
      setGlobalValue({ ...globalValue, configuration: newConf });
      toaster.info('导入成功');
    }

    close();
  };

  useEffect(() => {
    const read = async () => {
      if (file) {
        const str = await FileUtils.readFile(file);
        const { data, error } = Configuration.parseConfig(str);

        if (!error) {
          setImportingConfiguration(data);
          const { timestamp } = data;
          setConfInfo(`（last modified：${TimeUtils.format(timestamp)}）`);
        }
      }
    };

    read();
  }, [file]);

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
        {file ? (
          <div>
            确认导入此配置？<span className="import-conf-info">{confInfo}</span>
          </div>
        ) : (
          <div>请重新上传配置文件</div>
        )}
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
