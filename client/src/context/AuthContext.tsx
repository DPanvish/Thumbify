import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { IUser } from "../assets/assets";
import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import toast from "react-hot-toast";

interface AuthContextProps{
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    login: (user: {email: string; password: string}) => Promise<void>;
    signUp: (user: {name: string; email: string; password: string}) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    login: async() => {},
    signUp: async() => {},
    logout: async() => {},
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const signUpMutation = useMutation({
        mutationFn: async({name, email, password}: {name: string; email: string; password: string}) => {
            const {data} = await api.post("/api/auth/register", {name, email, password});

            if(data.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }

            toast.success(data.message);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    const loginMutation = useMutation({
        mutationFn: async({email, password}: {email: string; password: string}) => {
            const {data} = await api.post("/api/auth/login", {email, password});

            if(data.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }

            toast.success(data.message);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });
    
    const logoutMutation = useMutation({
        mutationFn: async() => {
            const {data} = await api.post("/api/auth/logout");
            setUser(null);
            setIsLoggedIn(false);
            toast.success(data.message);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    })

    const signUp = async(userData: {name: string; email: string; password: string}) => {
        await signUpMutation.mutateAsync(userData);
    }

    const login = async(userData: {email: string; password: string}) => {
        await loginMutation.mutateAsync(userData);
    }

    const logout = async() => {
        await logoutMutation.mutateAsync();
    }

    const fetchUser = async() => {
        try{
            const {data} = await api.get("/api/auth/verify");

            if(data.user){
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
        }catch(error){
            console.log(error);
        }
    }


    useEffect(() => {
        (async() => {
            await fetchUser();
        })();
    }, []);

    const value = {
        user, setUser, isLoggedIn, setIsLoggedIn, signUp, login, fetchUser, logout
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);