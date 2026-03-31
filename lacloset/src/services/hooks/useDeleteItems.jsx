import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../types/api";

export const useDeleteItems = () => {
  const queryClient = useQueryClient();

  // Delete function: expects the item ID or name
  const deleteItem = async (id) => {
    const res = await api.delete(`/item/deleteItem/${id}`);
    return res;
  };

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["items"]);
      toast.success(res.data?.message || "პროდუქტი წარმატებით წაიშალა");
    },
    onError: (error) => {
      console.error("პროდუქტის წაშლა ვერ მოხერხდა:", error);
      toast.error(error.response?.data?.message || "პროდუქტის წაშლა ვერ მოხერხდა");
    },
  });
};
