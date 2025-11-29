import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: useMutationCallback) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPostWithImages,
        onSuccess: () => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            // 1. 캐시 초기화
            queryClient.resetQueries({
                queryKey: QUERY_KEYS.post.list,
            });
        },
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
    });
}
