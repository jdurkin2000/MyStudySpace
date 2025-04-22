'use server'

import {signIn, signOut} from "app/auth";
import bcrypt from "bcryptjs";
import User from "@/models/userSchema";

export async function doLogout() {
    await signOut({ redirectTo: "/logout"});
}

export async function doCredentialsLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await signIn("credentials", {
            email, password, redirect: false
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function doSignup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
        if (!email || !password) throw new Error("email or password not provided");
        const hashed = bcrypt.hashSync(password);
        const newUser = {email: email, password: hashed};
        await User.create(newUser);
    } catch (error) {
        throw error;
    }
}