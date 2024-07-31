import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod"; 
import { usernameValidationSchema } from "@/Schema/signUpSchema";

const usernameQuesrySchema=z.object({
    username:usernameValidationSchema,
});

export async function GET(request:Request) {
    await dbConnect();

    try {
        const {searchParams}=new URL(request.url);
        const queryParams={
            username: searchParams.get("username")
        }

        const result = usernameQuesrySchema.safeParse(queryParams);
        //console.log(result) is result mai success field hota h data field hota hai error field hota hai and much more
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success:false,
                    message: usernameErrors.length>0 ? usernameErrors.join(',') : 'Invalid query parameters',
                },
                {
                    status:400
                }
            );
        }

        const {username} = result.data;
        const existingVerifiedUser= await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message: 'Username is already taken',
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message: "Username is unique",
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
        {
            success: false,
            message: 'Error checking username',
        },
        { status: 500 }
        );
    }
    
}