import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../types/items.api";

export const useItems = (enabled = true) => {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
