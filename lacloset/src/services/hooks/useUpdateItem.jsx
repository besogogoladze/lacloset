import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateItemById } from "../../types/updateItem.api";

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemById,
    onSuccess: () => {
      toast.success("პროდუქტი წარმატებით განახლდა");
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "განახლება ვერ მოხერხდა");
    },
  });
};
