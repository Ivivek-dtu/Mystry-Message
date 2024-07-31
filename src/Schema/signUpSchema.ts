import { z } from "zod";

export const usernameValidationSchema=z.string({message: " please enter string"})
                                        .min(3,"Username should contain a minimum of 3 characters")
                                        .max(20,"Username should contain a maximum of 20 characters only")
                                        .regex(/^[a-zA-Z0-9_]+$/,"Username should not contain any speacial character")

export const signUpSchema=z.object({
    username:usernameValidationSchema,
    email: z.string().email({message: "Invalid Email Address"}),

    password: z.string().min(6,{message: "Password must be atleast 6 characters"})
} )
