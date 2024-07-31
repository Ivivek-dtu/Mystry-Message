import { z } from "zod";

export const AcceptMessageSchema=z.object({
    Accept:z.boolean({message: "Accept message field should be boolean"})
} )
