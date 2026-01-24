import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateItemById } from "../../types/updateItem.api";

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemById,
    onSuccess: () => {
      toast.success("Item updated successfully");
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};
