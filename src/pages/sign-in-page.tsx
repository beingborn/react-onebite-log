import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password";
import { useState } from "react";
import { Link } from "react-router";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: signIn, data } = useSignInWithPassword();

    const handleSignInClick = async () => {
        if (email.trim() === "") return;
        if (password.trim() === "") return;

        signIn({ email, password });

        alert(`안녕하세요 ${data?.user.email}님`);
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
                <div>
                    <Button
                        onClick={handleSignInClick}
                        type="button"
                        className="w-full"
                    >
                        로그인
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
