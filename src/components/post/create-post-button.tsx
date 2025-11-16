import { PlusCircleIcon } from "lucide-react";
import { useOpenPostEditorModal } from "./../../store/post-editor-modal";

export default function CreatePostButton() {
    const openPostEditorModal = useOpenPostEditorModal();

    return (
        <button
            onClick={openPostEditorModal}
            className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
        >
            <div className="flex items-center justify-between">
                <p>나누고 싶은 이야기가 있나요?</p>
                <PlusCircleIcon className="h-5 w-5" />
            </div>
        </button>
    );
}
