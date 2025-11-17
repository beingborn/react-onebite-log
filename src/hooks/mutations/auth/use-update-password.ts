import { updatePassword } from "@/api/auth";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePassword(callbacks?: useMutationCallback) {
    return useMutation({
        mutationFn: updatePassword,
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error);
        },
        onSuccess: () => {
            if (callbacks?.onSuccess) callbacks.onSuccess();
        },
    });
}
