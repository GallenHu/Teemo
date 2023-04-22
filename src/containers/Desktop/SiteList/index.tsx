import SiteCreateModal from '@/components/SiteCreateModal';
import type Site from '@/containers/Desktop/SiteList/helper/Site';
import useConfirm from '@/hooks/useConfirm';
import useGlobalValue from '@/hooks/useGlobalState';
import Check from 'baseui/icon/check';
import Delete from 'baseui/icon/delete';
import Plus from 'baseui/icon/plus';
import update from 'immutability-helper';
import { useCallback, useState } from 'react';
import { useLongPress } from 'use-long-press';
import { throttle } from 'throttle-debounce';
import ListNode from './ListNode';
import Configuration from '@/utils/configuration';
import { Page } from '@/types/configuration.d';

interface Props {
  pageIndex: number;
  manageMode: boolean;
  setManageMode: (isManageMode: boolean) => void;
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
  const [deleteTarget, setDeleteTarget] = useState<DELETABLE_TARGET | null>(null);
  const { pageIndex, manageMode, setManageMode, onTriggerChangePage } = props;
  const { pages } = configuration;
  const [currentPage] = useState<Page>(pages[pageIndex]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const scrollContentStyle = {
    height: `${pages.length * 100}vh`,
    transform: `translate3D(0,${pageIndex * -100}vh, 0)`,
  };

  const updateConfiguration = (newConf: Configuration) => {
    setGlobalValue({ ...globalValue, configuration: newConf });
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
    setManageMode(true);
  });

  function onClickSite(site: Site, page: Page) {
    if (manageMode) {
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
    setIsOpenSiteCreateModal(true);
  }

  function onClickDeletePage(page: Page, pageIndex: number) {
    setDeleteTarget(DELETABLE_TARGET.page);

    showConfirm(`Confirm delete category "${page.name}" ?`);
  }

  function quitManageMode() {
    setManageMode(false);
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
    updateConfiguration(newConf);

    return true;
  }

  function onCloseSiteCreate() {
    setCurrentSite(null);
    setIsOpenSiteCreateModal(false);
  }

  function handleClickDeleteIcon(site: Site, page: Page) {
    setCurrentSite(site);
    setDeleteTarget(DELETABLE_TARGET.site);
    showConfirm(`Confirm delete site "${site.name}" ?`);
  }

  function onConfirmDelete() {
    if (deleteTarget === DELETABLE_TARGET.site) {
      const newConf = configuration.deleteSite(currentPage!.id || '', currentSite!);
      updateConfiguration(newConf);
    } else if (deleteTarget === DELETABLE_TARGET.page) {
      const newConf = configuration.deletePage(pageIndex);
      updateConfiguration(newConf);
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

  const throttleMoveCard = throttle(300, (cardId: string, hoverIndex: number) => {
    const siteList = [...(currentPage?.children || [])];

    const dragIndex = siteList.findIndex(item => item.id === cardId);

    const newSiteList = update(siteList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, siteList[dragIndex]],
      ],
    });

    const newConf = configuration.updatePageNodes(currentPage.id, newSiteList);

    updateConfiguration(newConf);
  });

  const moveCard = useCallback(throttleMoveCard, [throttleMoveCard]);

  return (
    <div className="site-list">
      <div className="scroll-content" data-index={pageIndex} style={scrollContentStyle}>
        {pages.map(page => {
          return (
            <section className="section" key={page.id}>
              {page.children.map((item, index) => (
                <ListNode
                  key={item.id}
                  type={item.type}
                  name={item.name}
                  manageMode={manageMode}
                  node={item}
                  page={page}
                  index={index}
                  onClickSite={onClickSite}
                  onClickDeleteIcon={handleClickDeleteIcon}
                  bindLongPress={bindLongPress}
                  moveCard={moveCard}
                />
              ))}

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
