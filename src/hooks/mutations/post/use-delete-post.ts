import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useDeletePost(callbacks?: useMutationCallback) {
    return useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            if (deletedPost.image_url && deletedPost.image_url.length > 0) {
                await deleteImagesInPath(
                    `${deletedPost.author_id}/${deletedPost.id}`,
                );
            }
        },
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
    });
}
