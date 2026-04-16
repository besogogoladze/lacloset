import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../types/auth.api";

export const useAuthUser = () => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getCurrentUser();
      // Return null for unauthenticated without causing React Query to log error
      return user;
    },
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};
