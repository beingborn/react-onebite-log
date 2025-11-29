import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost(callbacks?: useMutationCallback) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            if (deletedPost.image_url && deletedPost.image_url.length > 0) {
                await deleteImagesInPath(
                    `${deletedPost.author_id}/${deletedPost.id}`,
                );
            }

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
