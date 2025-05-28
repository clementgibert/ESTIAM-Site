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
    const {isAuthenticated, isInitialized} = useAuth();

    const [checked, setChecked] = useState(false);

     const check = useCallback(() => {
        if (!isInitialized) return;
        console.log(isAuthenticated)
        if (isAuthenticated) {
            // Do stuff
            //console.log("IDENTIFIED")
        } else {
            //console.log("NON IDENTIFIED")
            router.replace('/login');
        }

        setChecked(true);
    }, [isAuthenticated, isInitialized, router]);

    useEffect(() => {
        check()
        //setChecked(true);
    }, [check]);

    if (!checked || !isInitialized) {
        return null;
    }

    return <>{children}</>;
}
    
    