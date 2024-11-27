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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ISiteItem } from "@/types";
import { useState } from "react";

export function Configure({
  categoriesMap,
}: {
  categoriesMap: Record<string, ISiteItem[]>;
}) {
  const categories = Object.keys(categoriesMap);
  const [activeTab, setActiveTab] = useState(categories[0]);

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

        <DialogContent className="p-0 overflow-hidden md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogTitle className="sr-only">Configure</DialogTitle>

          <SidebarProvider className="items-start h-full min-h-0">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categories.map((categoryName) => (
                        <SidebarMenuItem key={categoryName}>
                          <SidebarMenuButton
                            asChild
                            isActive={categoryName === activeTab}
                          >
                            <a href="#">
                              {/* <item.icon /> */}
                              <span>{categoryName}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <div className="flex items-center px-4 py-2">
                <Button variant="ghost" size="sm" className="h-7">
                  New Category
                </Button>
              </div>
            </Sidebar>

            <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
              <div className="py-10 px-8">
                <ConfigureTable />
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
