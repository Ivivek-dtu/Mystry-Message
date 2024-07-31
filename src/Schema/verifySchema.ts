import { z } from "zod";

export const verifySchema=z.object({
    code:z.string()
        .length(6,"verification code should be of 6 characters")
        .regex(/^\d+$/,"Verification Code should contain Numbers only")
} )
