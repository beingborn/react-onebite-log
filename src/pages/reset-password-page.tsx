import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMessage } from "@/lib/error";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
        useUpdatePassword({
            onSuccess: () => {
                toast.info("비밀번호가 초기화 되었어요!", {
                    position: "top-center",
                });
            },
            onError: (error) => {
                const message = generateErrorMessage(error);

                toast.info(message, {
                    position: "top-center",
                });

                setPassword("");
            },
        });

    const handleUpdatePasswordClick = () => {
        if (password.trim() == "") return;

        updatePassword(password);

        navigate("/");
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold">비밀번호 재설정하기</h1>
                <p className="text-muted-foreground">
                    새로운 비밀번호를 입력하세요
                </p>
            </div>
            <Input
                disabled={isUpdatePasswordPending}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-6"
                placeholder="password"
            />
            <Button
                disabled={isUpdatePasswordPending}
                onClick={handleUpdatePasswordClick}
                className="w-full"
            >
                확인
            </Button>
        </div>
    );
}
