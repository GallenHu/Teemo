"use client";

import { ConfigureTable } from "./configure-table";
import { BoltIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { CreateCategoryForm } from "./create-category-form";
import type { ICategory, ISiteItem } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useCategory } from "@/hooks/use-category";
import { useFastToast } from "@/hooks/use-fast-toast";

const MainContentType = {
  create_category_form: "create_category_form",
  site_list: "site_list",
};

export function Configure() {
  const { getCategories } = useCategory();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sites, setSites] = useState<ISiteItem[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
  const { errorToast } = useFastToast();

  const reloadCategories = async () => {
    const res = await getCategories();
    if (res.success) {
      setCategories(res.data);
    } else {
      errorToast(res.error);
    }
  };

  const reloadSitesByCategory = async (category: string) => {
    // TODO: reload sites by category
    console.log(category);
  };

  const changeActiveTab = (tab?: string) => {
    console.log(changeActiveTab);

    if (categories.find((item) => item.name === tab)) {
      setActiveTab(tab!);
      reloadSitesByCategory(tab!);
    }
  };

  const mainContent = useMemo(() => {
    if (showCreateCategoryForm) {
      return MainContentType.create_category_form;
    } else {
      return MainContentType.site_list;
    }
  }, [activeTab, showCreateCategoryForm]);

  useEffect(() => {
    (async () => {
      await reloadCategories();

      // todo
      // changeActiveTab(categories[0]?.name);
    })();
  }, []);

  return (
    <>
      <Dialog>
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

          <SidebarProvider className="items-start h-full min-h-0">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categories.map((category) => (
                        <SidebarMenuItem key={category.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={category.name === activeTab}
                          >
                            <a href="#">
                              {/* <item.icon /> */}
                              <span>{category.name}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <div className="flex items-center px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={() => setShowCreateCategoryForm(true)}
                >
                  New Category
                </Button>
              </div>
            </Sidebar>

            <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
              <div className="py-10 px-8">
                {mainContent === MainContentType.create_category_form ? (
                  <CreateCategoryForm
                    onCancel={() => setShowCreateCategoryForm(false)}
                  />
                ) : (
                  <ConfigureTable sites={sites} />
                )}
              </div>
            </main>
          </SidebarProvider>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
