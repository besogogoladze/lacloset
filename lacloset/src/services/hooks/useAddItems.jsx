import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../types/api";

export const useAddItems = () => {
  const queryClient = useQueryClient();

  const addItem = async ({
    nom,
    description,
    price,
    priceInLari,
    size,
    image_url,
  }) => {
    const payload = {
      nom: nom,
      description: description,
      price: price,
      priceInLari: priceInLari,
      size: size,
      image_url: image_url,
      status: true,
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
      console.error("Failed to add item:", error);
      toast.error("Failed to add item");
    },
  });
};
