'use client';

import { ROUTES, STORAGE_KEY } from "@utils/config/constants";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isTransitioned, setIsTransitioned] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(pathname);

        const handleRouteChange = () => {
            handleTransition();
            authCheck(pathname);
        };

        handleRouteChange();

        return () => {
            handleTransition();
        };
    }, [pathname]);

    const checkIfTokenInvalid = (token: string) => {
        if (!token) return true;

        const decoded = JSON.parse(atob(token.split('.')[1]));

        return decoded.exp * 1000 < Date.now();
    };

    const handleTransition = () => {
        setIsTransitioned(true);
    };

    function authCheck(url: string) {
        setIsTransitioned(false);
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = [ROUTES.AUTH_LOGIN, ROUTES.AUTH_SIGNUP];

        const path = url.split('?')[0];
        const token = Cookies.get(STORAGE_KEY.ACCESS_TOKEN);

        if ((!token || (token && checkIfTokenInvalid(token))) && !publicPaths.includes(path)) {
            router.replace(ROUTES.AUTH_LOGIN);
        }
    }

    return isTransitioned
        ? null
        : <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} >
            {children}
        </motion.div>;
}

export default ProtectedRoute;