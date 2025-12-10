import { updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComment(callbacks?: useMutationCallback) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateComment,
        onSuccess: (updatedComment) => {
            if (callbacks?.onSuccess) callbacks.onSuccess();

            queryClient.setQueryData<Post>(
                QUERY_KEYS.comment.post(updatedComment.post_id),
                (prevComment) => {
                    if (!prevComment)
                        throw new Error(
                            `${updatedComment}에 해당하는 댓글 캐시 데이터를 찾을 수 없습니다.`,
                        );

                    return { ...prevComment, ...updatedComment };
                },
            );
        },
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
    });
}
