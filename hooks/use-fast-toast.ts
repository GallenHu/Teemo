import { useToast } from "./use-toast";

export function useFastToast() {
  const { toast } = useToast();

  const errorToast = (
    message: string,
    title = "Uh oh! Something went wrong."
  ) => {
    toast({
      variant: "destructive",
      title,
      description: message,
      duration: 3000,
    });
  };

  return { errorToast };
}
