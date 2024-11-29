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
import { useCategory } from "@/hooks/use-category";

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
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
}

export function CreateCategoryForm({ onCancel, onSuccess }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      order: 999,
    },
  });
  const { errorToast } = useFastToast();
  const { createCategory } = useCategory();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await createCategory(data.name);
    if (res.success) {
      onSuccess?.(res.data);
    } else {
      errorToast(res.message);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: Favorite" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
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
