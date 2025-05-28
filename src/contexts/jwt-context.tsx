'use client'
import { createContext, useEffect, useReducer, useCallback } from 'react';
import type { User } from '@/types/user';
import type { FC, ReactNode} from 'react';


interface State {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
}

enum ActionTypes {
    INITIALIZE = 'INITIALIZE',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT'
}

type initializeAction = {
    type: ActionTypes.INITIALIZE
    payload: {
        user: User | null;
        isAuthenticated: boolean;

    };
};
type SignInAction = {
    type: ActionTypes.SIGN_IN
    payload: {
        user: User;

    };
};

type SignOutAction = {
    type: ActionTypes.SIGN_OUT
};

type Action = initializeAction | SignInAction | SignOutAction;

type Handler = (state: State, action: any) => State;

const initialState: State = {
    isAuthenticated: false,
    isInitialized: false,
    user: null
};

const handlers : Record<ActionTypes, Handler> = {
    INITIALIZE: (state: State, action: initializeAction): State => {
        const {isAuthenticated, user}=action.payload;
        
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,

        }
    },
    
    SIGN_IN: (state: State, action: initializeAction): State => {
    const { user } = action.payload;
     return {
            ...state,
            isAuthenticated:true,
            user,
        };
    },

    SIGN_OUT: (state: State): State => {
    return {
            ...state,
            isAuthenticated:false,
            user: null,
        };
    }
};
         


const reducer = (state: State, action: Action): State =>
    handlers[action.type] ? handlers[action.type] (state, action) : state;

export interface AuthContextType extends State {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
    {
        ...initialState,
        signIn: () =>Promise.resolve(),
        signOut: () =>Promise.resolve(),
    }
);

interface AuthProviderProps {
    children: ReactNode;
}

export const  AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize =useCallback(async ():Promise<void> => {
        try {
            const accessToken = globalThis.localStorage.getItem('access_token');
            
            if (accessToken) {
                 const userResponse = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
                        method: 'GET',
                        headers: {
                            Authorization: 'Bearer ' + accessToken
                        }
                    });
                    const userResult = await userResponse.json();
                    globalThis.localStorage.setItem('user', JSON.stringify(userResult));

                    dispatch({
                        type: ActionTypes.INITIALIZE,
                        payload: {
                            user: userResult,
                            isAuthenticated:true,
                        }
                    });
            } else {
                 dispatch({
                    type: ActionTypes.INITIALIZE,
                    payload: {
                        isAuthenticated:false,
                        user: null,
                    }
                 })
            }
          } catch (err) {
            dispatch({
                    type: ActionTypes.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    }
                });
        }
    }, [dispatch]);
                       
                    
    useEffect(() => {
        initialize();
    }, []);

    const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": email,
            "password": password,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        // get token
        const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", requestOptions);
        const result = await response.json();
        globalThis.localStorage.setItem('access_token', result?.access_token);

        // get connected user
        const userResponse = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + result?.access_token
            }
        });

        const userResult = await userResponse.json();
        globalThis.localStorage.setItem('user', JSON.stringify(userResult));

        dispatch({
            type: ActionTypes.SIGN_IN,
            payload: {
                user: userResult
            }
        });
    
    }, [dispatch]);

 const signOut  = useCallback(async (): Promise<void> => {
          globalThis.localStorage.removeItem('access_token');
          globalThis.localStorage.removeItem('user');
     
          dispatch({
            type: ActionTypes.SIGN_OUT //on va reset, pas besoin de payload. C'est vide dans handlers.
          });
}, [dispatch])
    
 return (
        <AuthContext.Provider
            value={{
                ...state,
                signIn,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const AuthConsumer = AuthContext.Consumer;