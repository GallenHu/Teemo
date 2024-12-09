"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFastToast } from "@/hooks/use-fast-toast";
import { useCategory } from "@/hooks/use-category";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ICategory } from "@/types";
import { pick } from "lodash-es";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Category name must be at least 2 characters.",
  }),
  order: z.coerce
    .number()
    .int()
    .min(0, {
      message: "Order must be at least 0.",
    })
    .max(999, {
      message: "Order must be at most 999.",
    }),
});

interface Props {
  category?: ICategory & { _id: string };
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
  onDelete?: () => void;
}

export function CreateCategoryForm({
  category,
  onCancel,
  onDelete,
  onSuccess,
}: Props) {
  const isEditMode = !!category?.name;
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: isEditMode
      ? pick(category, ["name", "order"])
      : {
          name: "",
          order: 999,
        },
  });
  const { errorToast } = useFastToast();
  const { createCategory, updateCategory, deleteCategory } = useCategory();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const request = () =>
      isEditMode
        ? updateCategory(category!._id, { ...data })
        : createCategory({ ...data });
    const res = await request();
    if (res.success) {
      onSuccess?.(res.data);
    } else {
      errorToast(res.message);
    }
  }

  const handleDelete = async () => {
    const res = await deleteCategory(category!._id);
    if (res.success) {
      onDelete?.();
    } else {
      errorToast(res.message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit" : "Create"} category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: Favorite" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-[350px] space-y-2"
            >
              <div className="flex items-center gap-1">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="">
                    <ChevronRight className={isOpen ? "rotate-90" : ""} />
                    <span>More configure</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Order</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0~999"
                          {...field}
                          type="number"
                          min={0}
                          max={999}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>

              <span className="inline-flex gap-2">
                {isEditMode && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button type="submit">Submit</Button>
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
