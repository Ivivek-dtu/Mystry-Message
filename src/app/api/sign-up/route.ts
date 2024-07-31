import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../../helper/sendVerificationEmail';


export async function POST(request:Request) {
    await dbConnect();
    
    
    try {
        const {username,email,password}= await request.json();

        const userExistedisVerifiedByUsername = await UserModel.findOne({username,isVerified:true})

        if(userExistedisVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },
            {
                status:400
            });
        }

        const userExistedByEmail = await UserModel.findOne({email})
        const verifyCode= Math.floor(Math.random()*900000 +100000).toString();
        if(userExistedByEmail){
            if(userExistedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email",
                },
                {
                    status:400
                });
            }

            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            userExistedByEmail.password = hashedPassword;
            userExistedByEmail.verifyCode = verifyCode;
            userExistedByEmail.verifyCodeExpiry = expiryDate;


        }
        else{

            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser= new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            })

            await newUser.save();
        }

        //verification email
        const emailResponse =await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },
            {
                status:500
            });
        }

        return Response.json({
            success:true,
            message:"User registered successfully. Please verify your account.",
        },
        {
            status:201
        });

        
    } catch (error) {
        console.log("",error);
        return Response.json(
        {
            success:false,
            message:"Error regestering user"
        },
        {
            status:500
        });
    }
}