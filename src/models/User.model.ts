import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default:Date.now,
        required:true
    }
}) 

export interface User extends Document{
    username: string,
    email: string,
    password:string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified:boolean,
    isAcceptingMessages: boolean,
    messages: Message[],
}


const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required:[true,"Username is required"],
        unique:true,
        trim:true,

    },
    email:{
        type: String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"please use a valid Email Id"]
    },
    password:{
        type: String,
        required:[true,"Password is required"],
    },

    verifyCode:{
        type: String,
        required:[true,"Verify Code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true,"Verify Code Expiry is required"],
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));
export default UserModel;




// REGEX (REGULAR EXPRESSION)
// /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// Here's a breakdown of this RegEx pattern:

// ^: Asserts the start of the string.
// [a-zA-Z0-9._%+-]+: Matches one or more characters that can be letters (uppercase or lowercase), digits, dots, underscores, percent signs, plus signs, or hyphens (this is the local part of the email).
// @: Matches the "@" character.
// [a-zA-Z0-9.-]+: Matches one or more characters that can be letters (uppercase or lowercase), digits, dots, or hyphens (this is the domain part).
// \.: Matches the literal dot character.
// [a-zA-Z]{2,}: Matches two or more letters (this is the top-level domain, like "com", "org", etc.).
// $: Asserts the end of the string.
// Why Use RegEx for Validation?
// Ensures Correct Format: Using RegEx ensures that the input string adheres to a specific pattern, which is crucial for data like email addresses.
// Immediate Feedback: Provides immediate validation feedback, helping to catch errors early before saving to the database.
// Consistency: Ensures that all data entries follow a consistent format.
// Using RegEx for Email Validation in Mongoose
// When you use the match option in Mongoose with a RegEx for email validation, Mongoose will automatically check that any value assigned to the email field matches the specified pattern. If it doesn't match, Mongoose will throw a validation error.