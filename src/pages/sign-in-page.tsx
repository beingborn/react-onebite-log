import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password";
import { useState } from "react";
import { Link } from "react-router";

import githubLogo from "@/assets/github-mark.svg";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import { toast } from "sonner";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: signIn, data } = useSignInWithPassword({
        onError: (error) => {
            setPassword("");
            toast.error(error.message, {
                position: "top-center",
            });
        },
    });

    const { mutate: signInWithOAuth, data: provider } = useSignInWithOAuth();

    const handleSignInClick = async () => {
        if (email.trim() === "") return;
        if (password.trim() === "") return;

        signIn({ email, password });

        // alert(`안녕하세요 ${data?.user.email}님`);
    };

    const handleSignInWithGithubClick = async () => {
        signInWithOAuth("github");
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-xl font-bold">로그인</div>
            <div className="flex flex-col gap-2">
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-6"
                    type="email"
                    placeholder="example@abc.com"
                />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-6"
                    type="password"
                    placeholder="password"
                />
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleSignInClick}
                        type="button"
                        className="w-full"
                    >
                        로그인
                    </Button>
                    <Button
                        onClick={handleSignInWithGithubClick}
                        className="w-full"
                        type="button"
                        variant="outline"
                    >
                        <img
                            className="h-4 w-4"
                            src={githubLogo}
                            alt="깃허브 로고"
                        />
                        Github 계정으로 로그인
                    </Button>
                </div>
                <div>
                    <Link
                        className="text-muted-foreground hover:underline"
                        to={"/sign-in"}
                    >
                        계정이 없으시다면? 로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
