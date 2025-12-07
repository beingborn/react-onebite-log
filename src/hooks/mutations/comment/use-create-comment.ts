import { createComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment(callbacks?: useMutationCallback) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            // 1. 캐시 초기화
            queryClient.resetQueries({
                queryKey: QUERY_KEYS.comment.list,
            });
        },
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
    });
}
