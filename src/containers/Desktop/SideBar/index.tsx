import { Popover, StatefulPopover, TRIGGER_TYPE } from 'baseui/popover';
import { toaster } from 'baseui/toast';
import { useContext, useState } from 'react';
import CategoryCreateModal from '@/components/CategoryCreateModal';
import useGlobalValue from '@/hooks/useGlobalState';
import LoginModal from '@/components/Auth/LoginModal';
import ImportConfigModal from '@/components/ImportConfigModal';
import ConfirmImportModal from '@/components/ImportConfigModal/ConfirmModal';
import UserContext from '@/contexts/userContext';
import useConfirm from '@/hooks/useConfirm';
import PopupContainer, { Child as PopupChild } from './popup';
import FileUtils from '@/utils/file';
import { setRemote, getRemote } from '@/services/firestore';
import constants from '@/constants';
import bgImages from '@/constants/background-images';
import Configuration from '@/utils/configuration';
import { getRandomImage } from '@/utils/random';

interface Props {
  pageIndex: number;
  manageMode: boolean;
  onChangePage?: (pageIndex: number) => void;
  onTriggerManageUI?: () => void;
  onTriggerManageFinish?: () => void;
}

const { SYNC_CONFIRM_TIPS } = constants;

const popoverStyles = {
  Arrow: {
    style: ({ $theme }: { $theme: any }) => ({
      backgroundColor: $theme.colors.warning,
    }),
  },
  Body: {
    style: () => ({
      backgroundColor: 'transparent',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
      borderBottomLeftRadius: '4px',
      boxShadow: 'none',
    }),
  },
  Inner: {
    style: () => ({
      backgroundColor: 'transparent',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
      borderBottomLeftRadius: '4px',
    }),
  },
};

const usedBg: string[] = [];

export default function SideBar(props: Props) {
  const [globalValue, setGlobalValue] = useGlobalValue();
  const { configuration } = globalValue;
  const { pages } = configuration;
  const { pageIndex, manageMode, onTriggerManageUI, onTriggerManageFinish } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [categoryCreateModalVisible, setCategoryCreateModalVisible] = useState(false);
  const [isCategoryOnModify, setIsCategoryOnModify] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [confirmImportModalVisible, setConfirmImportModalVisible] = useState(false);
  const [active, setActive] = useState('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const updateConfiguration = (newConf: Configuration) => {
    setGlobalValue({ ...globalValue, configuration: newConf });
  };

  const { user } = useContext(UserContext);

  const [showConfirm, hideConfirm, ConfirmModal, changeSubmitting] = useConfirm(
    () => {
      if (confirmText === SYNC_CONFIRM_TIPS.toRemote) {
        syncToRemote();
      } else if (confirmText === SYNC_CONFIRM_TIPS.toLocal) {
        syncToLocal();
      }
    },
    () => {
      setConfirmText('');
      changeSubmitting(false);
      hideConfirm();
    }
  );

  function handleClickManageUI() {
    onTriggerManageUI?.();
  }
  function handleClickManageFinish() {
    onTriggerManageFinish?.();
  }
  function handleClickLogin() {
    setLoginModalVisible(true);
  }
  function importConfiguration() {
    handleClickManageFinish();
    setImportModalVisible(true);
  }

  /**
   * 确认同步
   */
  function syncRemote() {
    handleClickManageFinish();
    setConfirmText(SYNC_CONFIRM_TIPS.toRemote);
    showConfirm(SYNC_CONFIRM_TIPS.toRemote);
  }
  function syncLocal() {
    handleClickManageFinish();
    setConfirmText(SYNC_CONFIRM_TIPS.toLocal);
    showConfirm(SYNC_CONFIRM_TIPS.toLocal);
  }

  function updateCurrentCategory() {
    setIsCategoryOnModify(true);
    setCategoryCreateModalVisible(true);
  }

  function renderUserPopup() {
    const children: PopupChild[] = user
      ? [
          { text: '备份到云端', onClickEvent: syncRemote },
          { text: '从云端恢复', onClickEvent: syncLocal },
          { text: '退出登录', onClickEvent: handleClickLogin },
        ]
      : [{ text: '登录同步配置', onClickEvent: handleClickLogin }];

    return <PopupContainer children={children} />;
  }
  function renderCategoryPopup(id: string, text: string) {
    const classNames = ['sidebar-popover-content', active === id ? 'active' : ''].join(' ');
    return <div className={classNames}>{text}</div>;
  }
  function changeBG() {
    usedBg.push(configuration.bg);
    configuration.bg = getRandomImage({ excludes: usedBg });
    updateConfiguration(configuration);
    usedBg.length === bgImages.length && (usedBg.length = 0);
  }
  function renderSettingPopup() {
    const commChildren = [
      { text: '更换壁纸', onClickEvent: () => changeBG() },
      { text: '新增分类', onClickEvent: () => setCategoryCreateModalVisible(true) },
      { text: '编辑分类', onClickEvent: updateCurrentCategory },
      { text: '导出配置', onClickEvent: () => exportConfiguration() },
      { text: '导入配置', onClickEvent: () => importConfiguration() },
    ];
    const children: PopupChild[] = manageMode
      ? [{ text: '调整完毕', onClickEvent: handleClickManageFinish }, ...commChildren]
      : [{ text: '调整界面', onClickEvent: handleClickManageUI }, ...commChildren];
    return <PopupContainer children={children} />;
  }

  function handleMouseEnter(id: string) {
    setIsOpen(true);
    setActive(id);
  }
  function handleMouseLeave() {
    setIsOpen(false);
  }
  function handleChangePage(id: string, index: number) {
    props.onChangePage?.(index);
  }

  /**
   * 新建分类
   * @param name
   * @param icon
   */
  function onConfirmCategoryCreate(name: string, icon: string, isModify?: boolean) {
    let newConf: any = null;
    if (isModify) {
      newConf = configuration.updatePage(pageIndex, name, icon);
    } else {
      newConf = configuration.addPage(name, icon);
    }

    updateConfiguration(newConf);
    props.onChangePage?.(newConf.pages.length - 1);
    setCategoryCreateModalVisible(false);
    setIsCategoryOnModify(false);
  }
  function onCloseCategoryCreate() {
    setIsCategoryOnModify(false);
    setCategoryCreateModalVisible(false);
  }

  /**
   * 导出
   */
  function exportConfiguration() {
    const content = configuration.getConfiguration.call(configuration);
    FileUtils.writeFile(content, `config_${Date.now()}.json`);
  }
  function onFileUploaded(file: File) {
    if (file) {
      setUploadingFile(file);
      setImportModalVisible(false);
      setConfirmImportModalVisible(true);
    }
  }

  /**
   * 远程同步
   */
  async function syncToRemote() {
    const email = user?.email;
    if (email) {
      const encodedEmail = window.btoa(email);
      const content = configuration.getConfiguration.call(configuration);

      try {
        changeSubmitting(true);
        // no response data on success
        await setRemote(encodedEmail, { data: content });
        hideConfirm();
        toaster.positive('同步成功！');
      } catch (err) {
        console.error(err);
        toaster.negative('同步失败！');
      } finally {
        changeSubmitting(false);
      }
    } else {
      console.error('email not found on syncing!');
    }
  }
  async function syncToLocal() {
    const email = user?.email;
    if (email) {
      const encodedEmail = window.btoa(email);

      try {
        changeSubmitting(true);
        const res = await getRemote(encodedEmail);

        if (res?.data) {
          const { data, error } = Configuration.parseConfig(res.data);

          if (!error) {
            const newConf = configuration.applyConfiguration(data);
            updateConfiguration(newConf);
            hideConfirm();
            toaster.info('同步成功！');
          }
        } else {
          hideConfirm();
          toaster.negative('获取远程数据失败！');
        }
      } catch (err) {
        console.error(err);
        toaster.negative('同步失败！');
      } finally {
        changeSubmitting(false);
      }
    } else {
      console.error('email not found on syncing!');
    }
  }

  return (
    <div className="sidebar">
      <StatefulPopover
        triggerType={TRIGGER_TYPE.hover}
        content={renderUserPopup}
        overrides={popoverStyles}
        popoverMargin={8}
        placement={'right'}
      >
        <div className="icon-wrapper">
          <i className="iconfont icon-user"></i>
        </div>
      </StatefulPopover>
      <i className="dividing"></i>
      <div className="pages" onMouseLeave={handleMouseLeave}>
        {pages.map((page, index) => {
          return (
            <Popover
              key={page.id}
              isOpen={isOpen}
              content={renderCategoryPopup(page.id, page.name)}
              overrides={popoverStyles}
              popoverMargin={0}
              placement={'right'}
              onClick={() => handleChangePage(page.id, index)}
            >
              <div
                className={['icon-wrapper', pageIndex === index && 'active'].join(' ')}
                key={page.id}
                onMouseEnter={() => handleMouseEnter(page.id)}
              >
                <i className={'iconfont ' + page.icon}></i>
              </div>
            </Popover>
          );
        })}
      </div>
      <i className="dividing"></i>
      <StatefulPopover
        triggerType={TRIGGER_TYPE.hover}
        content={renderSettingPopup}
        overrides={popoverStyles}
        popoverMargin={8}
        placement={'right'}
      >
        <div className="icon-wrapper">
          <i className="iconfont icon-shezhi"></i>
        </div>
      </StatefulPopover>

      <CategoryCreateModal
        isOpen={categoryCreateModalVisible}
        defaultCategory={isCategoryOnModify ? pages[pageIndex] : null}
        onClose={onCloseCategoryCreate}
        onConfirm={onConfirmCategoryCreate}
      ></CategoryCreateModal>

      <LoginModal isOpen={loginModalVisible} onClose={() => setLoginModalVisible(false)} />

      <ImportConfigModal
        isOpen={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onFileUploaded={onFileUploaded}
      />

      <ConfirmImportModal
        file={uploadingFile}
        isOpen={confirmImportModalVisible}
        onClose={() => setConfirmImportModalVisible(false)}
      />

      <ConfirmModal />
    </div>
  );
}
