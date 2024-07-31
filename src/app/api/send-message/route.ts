import UserModel, { Message } from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { messageSchema } from "@/Schema/messageSchema";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username , content} = await request.json();

        // const result = messageSchema.safeParse(content);
        // if(!result.success){
        //     const messageErrors = result.error.format().content?._errors || [];
        //     return Response.json(
        //         {
        //             success:false,
        //             message: messageErrors.length>0 ? messageErrors.join(',') : "Invalid query parameters"
        //         },
        //         {
        //             status:400,
        //         }
        //     ) 
        // }

        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },
                {
                    status:400,
                }
            )
        }

        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success:false,
                    message:"user not accepting message at this moment"
                },
                {
                    status:403,
                }
            )
        }

        const newMessage = { content, createdAt: new Date() };

        
        user.messages.push(newMessage as Message); 
        await user.save();

        return Response.json(
            {
                success:true,
                message:"Message sent succesfully"
            },
            {
                status:200,
            }
        )




    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
        );
    }
}