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
  }) => {
    const payload = {
      buyer: buyer,
      soldItem: soldItem,
      description: description,
      priceInLari: priceInLari,
      priceInEuros: priceInEuros,
      pricePayedByClient: pricePayedByClient,
      priceOfTransport: priceOfTransport,
      totalProfit: totalProfit,
    };
    return await api.post("/item", payload);
  };

  return useMutation({
    mutationFn: addItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["items"]);
      toast.success(res.data.message);
    },
    onError: (error) => {
      console.error("პროდუქტის დამატება ვერ მოხერხდა:", error);
      toast.error("პროდუქტის დამატება ვერ მოხერხდა");
    },
  });
};
