import Delete from 'baseui/icon/delete';
import { useLongPress } from 'use-long-press';
import Widget from '@/components/Widget';
import { NotificationCircle } from 'baseui/badge';
import { ContentType, Page } from '@/types/configuration.d';
import SiteCreateModal from '@/components/SiteCreateModal';
import { useState } from 'react';
import IconColorBg from '@/components/IconColorBg';
import Site from '@/containers/Desktop/SiteList/helper/Site';
import useConfirm from '@/hooks/useConfirm';
import useGlobalValue from '@/hooks/useGlobalState';
import Plus from 'baseui/icon/plus';
import Check from 'baseui/icon/check';

interface Props {
  pageIndex: number;
  manageMode: boolean;
  onLongPress?: () => void;
  onTriggerQuitManageMode?: () => void;
  onTriggerChangePage?: (pageIndex: number) => void;
}

enum DELETABLE_TARGET {
  site = 1,
  page = 2,
}

export default function SiteList(props: Props) {
  const [globalValue, setGlobalValue] = useGlobalValue();
  const { configuration } = globalValue;
  const [isOpenSiteCreateModal, setIsOpenSiteCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DELETABLE_TARGET | null>(null);
  const { pageIndex, manageMode, onTriggerQuitManageMode, onTriggerChangePage } = props;
  const { pages } = configuration;
  const scrollContentStyle = {
    height: `${pages.length * 100}vh`,
    transform: `translate3D(0,${pageIndex * -100}vh, 0)`,
  };

  const [showConfirm, hideConfirm, ConfirmModal] = useConfirm(
    () => {
      onConfirmDelete();
    },
    () => {
      // handle cancel
      onCancelDelete();
    }
  );

  const bindLongPress = useLongPress(() => {
    props.onLongPress?.();
  });

  function onClickSite(site: Site, page: Page) {
    if (manageMode) {
      setCurrentPage(page);
      setCurrentSite(site);
      setIsOpenSiteCreateModal(true);
    } else {
      window.open(site.url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * 新增图标
   * @param page
   */
  function onClickAdd(page: Page) {
    setCurrentPage(page);
    setIsOpenSiteCreateModal(true);
  }

  function onClickDeletePage(page: Page, pageIndex: number) {
    setCurrentPage(page);
    setDeleteTarget(DELETABLE_TARGET.page);

    showConfirm(`Confirm delete category "${page.name}" ?`);
  }

  function quitManageMode() {
    onTriggerQuitManageMode?.();
  }

  /**
   * 调整完毕
   */
  function onClickFinish() {
    quitManageMode();
  }

  function onConfirmSiteCreate(site: Site, isModify?: boolean) {
    if (!currentPage?.id) {
      throw new Error('Could not locate current page!');
    }

    let newConf: any = null;
    if (isModify) {
      newConf = configuration.updateSite(currentPage!.id || '', site);
    } else {
      newConf = configuration.addSite(currentPage!.id || '', site);
    }

    setCurrentSite(null);
    setIsOpenSiteCreateModal(false);
    setGlobalValue({ ...globalValue, configuration: newConf });
  }

  function onCloseSiteCreate() {
    setCurrentSite(null);
    setIsOpenSiteCreateModal(false);
  }

  function handleClickDeleteIcon(site: Site, page: Page) {
    setCurrentSite(site);
    setCurrentPage(page);
    setDeleteTarget(DELETABLE_TARGET.site);
    showConfirm(`Confirm delete site "${site.name}" ?`);
  }

  function onConfirmDelete() {
    if (deleteTarget === DELETABLE_TARGET.site) {
      const newConf = configuration.deleteSite(currentPage!.id || '', currentSite!);
      setGlobalValue({ ...globalValue, configuration: newConf });
    } else if (deleteTarget === DELETABLE_TARGET.page) {
      const newConf = configuration.deletePage(pageIndex);
      setGlobalValue({ ...globalValue, configuration: newConf });
      onTriggerChangePage?.(Math.max(pageIndex - 1, 0));
      quitManageMode();
    }

    hideConfirm();
    setDeleteTarget(null);
  }

  function onCancelDelete() {
    setCurrentSite(null);
    setDeleteTarget(null);
  }

  function renderSite(site: Site, page: Page) {
    const renderSiteIcon = () => (
      <div key={site.id} className="site-item" onClick={() => onClickSite(site, page)} {...bindLongPress()}>
        {site.bgType === 'image' ? (
          <div className="icon" style={{ backgroundImage: `url(${site.bgImage})` }}></div>
        ) : (
          <IconColorBg bgColor={site.bgColor} text={site.iconText || site.name.slice(0, 1).toUpperCase()} />
        )}
        <div className="name">{site.name}</div>
      </div>
    );

    return manageMode ? (
      <NotificationCircle
        key={site.id}
        content={<Delete className="icon-close" onClick={() => handleClickDeleteIcon(site, page)} />}
      >
        {renderSiteIcon()}
      </NotificationCircle>
    ) : (
      renderSiteIcon()
    );
  }

  return (
    <div className="site-list">
      <div className="scroll-content" data-index={pageIndex} style={scrollContentStyle}>
        {pages.map(page => {
          return (
            <section className="section" key={page.id}>
              {page.children.map(item => {
                return item.type === ContentType.WIDGET ? (
                  <Widget key={item.id} name={item.name} />
                ) : (
                  renderSite(item, page)
                );
              })}

              {manageMode ? (
                <>
                  <div className="site-item">
                    <div className="extra-site-icon-wrapper" onClick={() => onClickAdd(page)}>
                      <Plus className="extra-site-icon" />
                    </div>
                    <div className="name">新增图标</div>
                  </div>

                  {pageIndex === 0 ? null : (
                    <div className="site-item">
                      <div className="extra-site-icon-wrapper" onClick={() => onClickDeletePage(page, pageIndex)}>
                        <Delete className="extra-site-icon" />
                      </div>
                      <div className="name">删除此页</div>
                    </div>
                  )}

                  <div className="site-item">
                    <div className="extra-site-icon-wrapper" onClick={() => onClickFinish()}>
                      <Check className="extra-site-icon" />
                    </div>
                    <div className="name">调整完毕</div>
                  </div>
                </>
              ) : null}
            </section>
          );
        })}
      </div>

      <SiteCreateModal
        defaultSite={currentSite}
        isOpen={isOpenSiteCreateModal}
        onClose={onCloseSiteCreate}
        onConfirm={onConfirmSiteCreate}
      ></SiteCreateModal>

      <ConfirmModal />
    </div>
  );
}
