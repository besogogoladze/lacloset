import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateItemStatus } from "../../types/updateItemStatus.api";

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateItemStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
    onError: (err) => {
      toast.error(err.response?.data || "Failed to place order");
      console.log(err);
    },
  });
};
