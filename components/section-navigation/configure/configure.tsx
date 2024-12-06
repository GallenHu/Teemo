"use client";

import { ConfigureTable } from "./configure-table";
import {
  BoltIcon,
  Pencil,
  DownloadIcon,
  FolderUpIcon,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateCategoryForm } from "./create-category-form";
import { CreateSiteForm } from "./create-site-form";
import type { ICategory, ISiteItem } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "@/hooks/use-site";
import { useCategory } from "@/hooks/use-category";
import { useExport } from "@/hooks/use-export";
import { useFastToast } from "@/hooks/use-fast-toast";
import { arrayMove } from "@dnd-kit/sortable";

interface Props {
  onCloseDialog?: () => void;
}

const MainContentType = {
  create_category_form: "create_category_form",
  edit_category_form: "edit_category_form",
  create_site_form: "create_site_form",
  site_list: "site_list",
};

export function Configure({ onCloseDialog }: Props) {
  const { getCategories, getCategorySites } = useCategory();
  const { exportData, importData } = useExport();
  const { reorder } = useSite();
  const [categories, setCategories] = useState<(ICategory & { _id: string })[]>(
    []
  );
  const [editingSite, setEditingSite] = useState<ISiteItem & { _id: string }>();
  const [editingCategory, setEditingCategory] = useState<
    ICategory & { _id: string }
  >();
  const [sites, setSites] = useState<ISiteItem[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateSite, setShowCreateSite] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { errorToast } = useFastToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.name === activeTab);
  }, [categories, activeTab]);

  const reloadCategories = async () => {
    const res = await getCategories();
    if (res.success) {
      setCategories(res.data);
    } else {
      errorToast(res.error);
    }
  };

  const reloadSitesByCategory = async (categoryId: string) => {
    const res = await getCategorySites(categoryId);
    if (res.success) {
      setSites(res.data);
    } else {
      errorToast(res.message);
    }
  };

  const handleSuccessCreateCategory = async (
    category: ICategory & { _id: string }
  ) => {
    reloadCategories();
    setShowCreateCategory(false);
  };

  const handleCategoryDeleted = async () => {
    setShowCreateCategory(false);
    await reloadCategories();
    setActiveTab(categories[0]?.name || "");
  };

  const handleSiteDeleted = async () => {
    setShowCreateSite(false);
    await reloadSitesByCategory(activeCategory!._id);
  };

  const handleSuccessCreateSite = (site: ISiteItem) => {
    setShowCreateSite(false);
    reloadSitesByCategory(site.category!);
  };

  const handleSort = async (oldIndex: number, newIndex: number) => {
    const newSites = arrayMove(sites, oldIndex, newIndex);

    newSites.forEach((site, index) => {
      site.order = index;
    });

    setSites(newSites);

    const res = await reorder(activeCategory!._id, newSites);
    if (!res.success) {
      errorToast(res.message);
    }
  };

  const handleClickCreateSite = () => {
    setShowCreateSite(true);
  };

  const handleClickEditSite = (site: any) => {
    setEditingSite(site);
    setShowCreateSite(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setShowCreateCategory(false);
      onCloseDialog?.();
    }
  };

  const handleClickCategory = async (category: ICategory) => {
    setActiveTab(category.name);
  };

  const handleClickEditCategory = (category: ICategory & { _id: string }) => {
    setEditingCategory(category);
    setShowCreateCategory(true);
  };

  const handleClickNewCategory = () => {
    setEditingCategory(undefined);
    setShowCreateCategory(true);
  };

  const handleClickExportData = () => {
    exportData();
  };

  const handleImportData = (e: any) => {
    setIsImportOpen(false);
    (fileInputRef.current as HTMLInputElement).click();
  };

  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    if (files?.length) {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      const res = await importData(formData);
      setLoading(false);
      if (res.success) {
        reloadCategories();
      } else {
        errorToast(res.message);
      }
    }
  };

  const mainContentType = useMemo(() => {
    if (showCreateSite) {
      return MainContentType.create_site_form;
    } else if (showCreateCategory) {
      return MainContentType.create_category_form;
    } else {
      return MainContentType.site_list;
    }
  }, [activeTab, showCreateCategory, showCreateSite]);

  useEffect(() => {
    activeCategory && reloadSitesByCategory(activeCategory._id);
  }, [activeCategory]);

  useEffect(() => {
    if (!activeTab && categories.length) {
      setActiveTab(categories[0].name);
    }
  }, [categories]);

  useEffect(() => {
    reloadCategories();
  }, []);

  function renderMainContent(mainContentType: string): JSX.Element {
    switch (mainContentType) {
      case MainContentType.create_site_form:
      case MainContentType.create_site_form:
        return (
          <CreateSiteForm
            category={activeTab}
            site={editingSite}
            onCancel={() => setShowCreateSite(false)}
            onSuccess={(site) => handleSuccessCreateSite(site)}
            onDelete={handleSiteDeleted}
          />
        );
      case MainContentType.create_category_form:
      case MainContentType.edit_category_form:
        return (
          <CreateCategoryForm
            category={editingCategory}
            onCancel={() => setShowCreateCategory(false)}
            onSuccess={(category) => handleSuccessCreateCategory(category)}
            onDelete={handleCategoryDeleted}
          />
        );
      default:
        return (
          <ConfigureTable
            sites={sites}
            enableCreate={!!categories?.length}
            onSort={handleSort}
            onClickCreate={handleClickCreateSite}
            onClickEdit={handleClickEditSite}
          />
        );
    }
  }

  return (
    <>
      <Dialog onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 px-0 absolute right-5 top-4 text-gray-300 cursor-pointer hover:text-gray-500"
          >
            <BoltIcon />
            <span className="sr-only">Configure</span>
          </Button>
        </DialogTrigger>

        {/* reset width with max-w */}
        <DialogContent className="p-0 overflow-hidden max-h-[500px] max-w-[800px] ">
          <DialogTitle className="sr-only">Configure</DialogTitle>

          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoaderCircle className="animate-spin text-gray-600" size={60} />
            </div>
          ) : (
            <>
              <SidebarProvider className="items-start h-full min-h-0">
                <Sidebar collapsible="none" className="hidden md:flex">
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {categories.map((category) => (
                            <SidebarMenuItem
                              key={category.name}
                              className="flex justify-between items-center group"
                            >
                              <SidebarMenuButton
                                asChild
                                isActive={category.name === activeTab}
                                onClick={() => handleClickCategory(category)}
                              >
                                <a href="#">
                                  {/* <item.icon /> */}
                                  <span>{category.name}</span>
                                </a>
                              </SidebarMenuButton>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-3 px-1.5 text-gray-500 hover:text-gray-700 invisible group-hover:visible"
                                onClick={() =>
                                  handleClickEditCategory(category)
                                }
                              >
                                <Pencil size={14} />
                              </Button>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>

                  <div className="flex items-center justify-between px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={handleClickNewCategory}
                    >
                      New Category
                    </Button>

                    <div>
                      <TooltipProvider delayDuration={300}>
                        <input
                          className="hidden"
                          type="file"
                          name="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="group/toggle h-8 w-8 px-0 text-gray-400"
                              onClick={handleClickExportData}
                            >
                              <DownloadIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Export Data</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="group/toggle h-8 w-8 px-0 text-gray-400"
                              onClick={() => setIsImportOpen(true)}
                            >
                              <FolderUpIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Import Data</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </Sidebar>

                <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
                  <div className="py-10 px-8">
                    {renderMainContent(mainContentType)}
                  </div>
                </main>
              </SidebarProvider>

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </>
          )}

          <AlertDialog open={isImportOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Overwrite remote data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will overwrite the remote data with the imported
                  data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsImportOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleImportData}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>
    </>
  );
}
