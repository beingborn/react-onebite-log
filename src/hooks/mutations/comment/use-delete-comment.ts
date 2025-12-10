import { deleteComment } from "@/api/comment";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(callbacks?: useMutationCallback) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: async (deletedComment) => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            // 1. 캐시 초기화
            // queryClient.resetQueries({
            //     queryKey: QUERY_KEYS.comment.list
            // });
        },
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
    });
}
