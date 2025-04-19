'use server'

import {signIn, signOut} from "app/auth";

export async function doLogout() {
    await signOut({redirectTo: "/"});
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