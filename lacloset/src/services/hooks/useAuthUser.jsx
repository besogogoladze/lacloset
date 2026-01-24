import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../types/auth.api";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};
