"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { keys } from "@/lib/api/queryKeys";

export function useWishlist() {
  return useQuery({
    queryKey: keys.wishlist.all,
    queryFn: getWishlist,
    retry: false,
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, inWishlist }: { productId: string; inWishlist: boolean }) =>
      inWishlist ? removeFromWishlist(productId) : addToWishlist(productId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: keys.wishlist.all });
      toast.success(vars.inWishlist ? "Removed from wishlist" : "Added to wishlist");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Please login first");
    },
  });
}
