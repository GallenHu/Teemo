import { Input } from 'baseui/input';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { useEffect, useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import { TwitterPicker } from 'react-color';
import IconColorBg from '@/components/IconColorBg';
import { Radio, RadioGroup } from 'baseui/radio';
import constants from '@/constants';
import Site from '@/containers/Desktop/SiteList/helper/Site';

interface Props {
  isOpen: boolean;
  defaultSite: Site | null;
  onClose?: () => void;
  onConfirm?: (site: Site, isModify?: boolean) => void;
}

export default function SiteCreateModal(props: Props) {
  const { isOpen, defaultSite, onClose, onConfirm } = props;
  const [name, setName] = useState(defaultSite?.name ?? '');
  const [url, setUrl] = useState(defaultSite?.url ?? '');
  const [type, setType] = useState<'image' | 'color'>(defaultSite?.bgType ?? 'image');
  const [img, setImg] = useState(defaultSite?.bgImage ?? '');
  const [color, setColor] = useState(defaultSite?.bgColor ?? constants.DEFAULT_ICON_BG_COLOR);
  const [iconText, setIconText] = useState(defaultSite?.iconText ?? '');
  const [shouldShowError, setShouldShowError] = useState(false);

  const onBlurUrl = () => {
    if (!url.trim()) {
      setShouldShowError(false);
      return;
    }

    const valid = url.startsWith('http://') || url.startsWith('https://');
    setShouldShowError(!valid);
  };

  const close = () => {
    setName('');
    setUrl('');
    setType('image');
    setImg('');
    setColor(constants.DEFAULT_ICON_BG_COLOR);
    setIconText('');

    onClose && onClose();
  };

  const confirmCreate = () => {
    const site = new Site({
      name,
      url,
      bgType: type,
    });
    if (type === 'image') {
      site.bgImage = img;
    } else {
      site.bgColor = color;
      site.iconText = iconText;
    }

    onConfirm && onConfirm(site, !!defaultSite);
  };

  const confirmUpdate = () => {
    const site = { ...(defaultSite as Site) };

    site.name = name;
    site.url = url;
    site.bgType = type;
    if (type === 'image') {
      site.bgImage = img;
    } else {
      site.bgColor = color;
      site.iconText = iconText;
    }

    onConfirm && onConfirm(site, !!defaultSite);
  };

  const confirm = () => {
    if (!name || !url) return;

    if (defaultSite) {
      confirmUpdate();
    } else {
      confirmCreate();
    }
  };

  useEffect(() => {
    if (defaultSite) {
      setName(defaultSite?.name || '');
      setUrl(defaultSite?.url || '');
      setType(defaultSite?.bgType || 'image');
      setImg(defaultSite?.bgImage || '');
      setColor(defaultSite?.bgColor || constants.DEFAULT_ICON_BG_COLOR);
      setIconText(defaultSite?.iconText || '');
    }
  }, [defaultSite]);

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
      <ModalHeader>{defaultSite ? '修改' : '新增'}图标</ModalHeader>
      <ModalBody>
        <FormControl>
          <Input value={name} onChange={event => setName(event.currentTarget.value)} placeholder="网站名称" />
        </FormControl>
        <FormControl>
          <Textarea
            value={url}
            onChange={event => setUrl(event.currentTarget.value)}
            placeholder="网站地址"
            error={shouldShowError}
            onBlur={onBlurUrl}
          />
        </FormControl>
        <FormControl label="图标类型">
          <RadioGroup align="horizontal" value={type} onChange={event => setType(event.currentTarget.value as any)}>
            <Radio value="image">网络图标</Radio>
            <Radio value="color">纯色图标</Radio>
          </RadioGroup>
        </FormControl>
        {type === 'image' ? (
          <FormControl>
            <Textarea value={img} onChange={event => setImg(event.currentTarget.value)} placeholder="图标URL" />
          </FormControl>
        ) : (
          <div className="color-configure">
            <FormControl>
              <TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} />
            </FormControl>
            <FormControl>
              <Input
                overrides={{
                  Root: {
                    style: {
                      width: '276px',
                    },
                  },
                }}
                maxLength={2}
                value={iconText}
                onChange={event => setIconText(event.currentTarget.value)}
                placeholder="显示文字(最多2字)"
              />
            </FormControl>
            <div className="preview">
              <IconColorBg bgColor={color} text={iconText}></IconColorBg>
            </div>
          </div>
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
