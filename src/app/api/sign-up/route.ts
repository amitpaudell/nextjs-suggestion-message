import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { success } from 'zod';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const exsitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exsitingUserVerifiedByUsername) {
      return Response.json({
        sucess: false, //because now you cann't register new account
        message: 'Username is already taken',
      });
    }

    const exsitingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exsitingUserByEmail) {
      if (exsitingUserByEmail.isVerified) {
        return Response.json(
          {
            sucess: false,
            message: 'User already exist with this email',
          },
          { status: 500 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exsitingUserByEmail.password = hashedPassword;
        exsitingUserByEmail.verifyCode = verifyCode;
        exsitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await exsitingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    if (!emailResponse.sucess) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: 'User registered sucessfully, Please verify email',
      },
      { status: 201 },
    );
  } catch (error) {
    console.log('Error registering user', error);
    return Response.json({
      success: false,
      message: 'Error registering user',
    });
  }
}
