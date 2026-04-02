import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../types/auth.api";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getCurrentUser();
      // Return null for unauthenticated without causing React Query to log error
      return user ?? null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // cache 5 min
    onError: (err) => {
      // Only log unexpected errors
      if (err.response?.status !== 401) {
        console.error(err);
      }
    },
  });
};
