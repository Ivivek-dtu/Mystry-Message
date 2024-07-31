import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { date, z } from "zod"; 
import { verifySchema } from "@/Schema/verifySchema";

// const verifyQuerySchema=z.object({
//     Code: verifySchema,
// })
// humne yha object nhi bnaya kyuki verifyschema is already an z.object look in verification file but in usernamevalidaition we implicitly created a username validator and that's why we have to create an object bcoz it was not wrapped in an object
export async function POST(request:Request) {
    await dbConnect();

    try {
        const requestBody = await request.json();

        const result = verifySchema.safeParse(requestBody)

        if(!result.success){
            const verifyCodeErrors = result.error.format().code?._errors || [];
            return Response.json(
                {
                    success:false,
                    message: verifyCodeErrors.length>0 ? verifyCodeErrors.join(',') : 'Invalid query parameters',
                },
                {
                    status:400
                }
            )
        }

        const { username , code } = requestBody;
        const decodedUsername= decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername,isVerified:false});

        // humne ye functionality di hai ki verification se pehle agr same username koi or leke verify karleta hai to vo username uska hojayega
        if (!user) {
            return Response.json(
              { success: false, message: 'User not found or already verified' },
              { status: 404 }
            );
        }

        const codeVerify = code===user.verifyCode;
        const expiryVerify = new Date(user.verifyCodeExpiry) > new Date();

        if(codeVerify && expiryVerify){
            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        } else if (!expiryVerify) {
            // Code has expired
            return Response.json(
                {
                success: false,
                message:
                    'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            // Code is incorrect
            return Response.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
            );
        }

        

        

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
        { success: false, message: 'Error verifying user' },
        { status: 500 }
        );
    }
    
}