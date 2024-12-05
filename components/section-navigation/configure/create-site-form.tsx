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
import { useFastToast } from "@/hooks/use-fast-toast";
import { useSite } from "@/hooks/use-site";
import { ISiteItem } from "@/types";
import { pick } from "lodash-es";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url("Invalid URL"),
  icon: z.union([z.literal(""), z.string().trim().url()]),
});

interface Props {
  category: string;
  site?: ISiteItem & { _id: string };
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
  onDelete?: () => void;
}

export function CreateSiteForm({
  category,
  site,
  onCancel,
  onSuccess,
  onDelete,
}: Props) {
  const isEditMode = !!site?._id;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: isEditMode
      ? pick(site, ["name", "url", "icon"])
      : {
          name: "",
          url: "",
          icon: "",
        },
  });
  const { errorToast } = useFastToast();
  const { createSite, updateSite, deleteSite } = useSite();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const request = () =>
      isEditMode
        ? updateSite(site!._id, { ...site, ...data })
        : createSite({ ...data, category, order: 999 });
    const res = await request();
    if (res.success) {
      onSuccess?.(res.data);
    } else {
      errorToast(res.message);
    }
  }

  const handleDelete = async () => {
    const res = await deleteSite(site!._id);
    if (res.success) {
      onDelete?.();
    } else {
      errorToast(res.message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create site</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: Google" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Site URL</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: https://google.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Site ICON</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Optional) eg: https://img.url"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
