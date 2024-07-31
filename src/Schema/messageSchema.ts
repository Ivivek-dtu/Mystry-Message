import { z } from "zod";

export const messageSchema=z.object({
    content: z.string().min(1,"message should not be empty").max(300,"message should not exceed 300 words")
} )