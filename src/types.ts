import { type Database } from "./database.type";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type useMutationCallback = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onMutate?: () => void;
    onSettled?: () => void;
};
