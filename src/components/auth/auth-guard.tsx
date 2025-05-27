'use client'
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import  { useAuth } from '@/hooks/use-auth';


export interface AuthGuardProps {
    children: React.ReactNode;

}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
    const router = useRouter();
    const {isAuthenticated} = useAuth();

    const [checked, setChecked] = useState(false);

     const check = useCallback(() => {
        if (isAuthenticated) {
            // Do stuff
        } else {
            router.replace('/login');
        }

        setChecked(true);
    }, [isAuthenticated, router]);

    useEffect(() => {
        check();
        // setChecked(true);
    }, []);

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}
    
    