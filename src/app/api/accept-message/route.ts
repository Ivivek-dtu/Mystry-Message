import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { z } from "zod";
import { AcceptMessageSchema } from "@/Schema/acceptMessageSchema";

export async function POST(request: Request) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
      return new Response(
          JSON.stringify({ success: false, message: 'Not authenticated' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  console.log(request.json());

  try {
      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { isAcceptingMessages: acceptMessages },
          { new: true }
      ).lean(); // Use lean() to return a plain JavaScript object

      if (!updatedUser) {
          return new Response(
              JSON.stringify({
                  success: false,
                  message: 'Unable to find user to update message acceptance status',
              }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
      }

      return new Response(
          JSON.stringify({
              success: true,
              message: 'Message acceptance status updated successfully',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

  } catch (error) {
      return new Response(
          JSON.stringify({ success: false, message: 'Error updating message acceptance status' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
  }
}


export async function GET(request:Request){
    await dbConnect();

    const session =await getServerSession(authOptions);
    const user:User = session?.user;
    if(!session || !session.user ){
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
          // User not found
          return Response.json(
            { success: false, message: 'User not found' },
            { status: 404 }
          );
        }
    
        // Return the user's message acceptance status
        return Response.json(
          {
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages,
          },
          { status: 200 }
        );

    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
          {
            success: false,
            message: "Error retrieving message acceptance status",
          },
          { status: 500 }
        );
    }
}