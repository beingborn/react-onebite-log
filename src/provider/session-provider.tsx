import GlobalLoader from "@/components/global-loader";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSetSession } from "@/store/session";
import type { ReactNode } from "react";
import { useEffect } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
    const setSession = useSetSession();
    const isSessionLoaded = useIsSessionLoaded();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
    });

    if (!isSessionLoaded) return <GlobalLoader />;

    return children;
}
