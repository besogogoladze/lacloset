import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../types/api";

export const useAddItems = () => {
  const queryClient = useQueryClient();

  const addItem = async ({
    buyer,
    soldItem,
    description,
    priceInLari,
    priceInEuros,
    pricePayedByClient,
    priceOfTransport,
    totalProfit,
    dealDate,
  }) => {
    const payload = {
      buyer,
      soldItem,
      description,
      priceInLari,
      priceInEuros,
      pricePayedByClient,
      priceOfTransport,
      totalProfit,
      dealDate: dealDate ? new Date(dealDate).toISOString() : null,
    };
    return await api.post("/item", payload);
  };

  return useMutation({
    mutationFn: addItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success(res.data.message);
    },
    onError: (error) => {
      console.error("პროდუქტის დამატება ვერ მოხერხდა:", error);
      toast.error(
        error.response?.data?.message || "პროდუქტის დამატება ვერ მოხერხდა",
      );
    },
  });
};
