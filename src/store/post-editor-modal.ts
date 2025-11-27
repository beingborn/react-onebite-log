import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type CreateMode = {
    isOpen: true;
    type: "CREATE";
};

type EditMode = {
    isOpen: true;
    type: "EDIT";
    postId: number;
    content: string;
    imageUrl: string[] | null;
};

type OpenState = CreateMode | EditMode;

type CloseState = {
    isOpen: false;
};

const initialState = {
    isOpen: false,
} as State;

type State = CloseState | OpenState;

const usePostEditorModalStore = create(
    devtools(
        combine(initialState, (set) => ({
            actions: {
                openCreate: () => {
                    set({ isOpen: true, type: "CREATE" });
                },
                openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
                    set({ isOpen: true, type: "EDIT", ...param });
                },
                close: () => {
                    set({ isOpen: false });
                },
            },
        })),
        { name: "postEditorModalStore" },
    ),
);

export const useOpenCreatePostModal = () => {
    const openCreate = usePostEditorModalStore(
        (store) => store.actions.openCreate,
    );

    return openCreate;
};

export const useOpenEditPostModal = () => {
    const openEdit = usePostEditorModalStore((store) => store.actions.openEdit);

    return openEdit;
};

export const usePostEditorModal = () => {
    const store = usePostEditorModalStore();
    return store as typeof store & State;
};
