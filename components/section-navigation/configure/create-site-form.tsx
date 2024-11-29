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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFastToast } from "@/hooks/use-fast-toast";
import { useSite } from "@/hooks/use-site";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url("Invalid URL"),
  icon: z.string(),
});

interface Props {
  category: string;
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
}

export function CreateSiteForm({ category, onCancel, onSuccess }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      url: "",
      icon: "",
    },
  });
  const { errorToast } = useFastToast();
  const { createSite } = useSite();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await createSite({ ...data, category, order: 999 });
    if (res.success) {
      onSuccess?.(res.data);
    } else {
      errorToast(res.message);
    }
  }

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
                    <Input placeholder="eg: https://img.url" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
