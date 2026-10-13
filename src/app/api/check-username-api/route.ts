import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { success, z } from 'zod';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    //This checks whether the extracted username satisfies your schema.
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(',')
              : 'Invalid query parameter',
        },
        { status: 400 },
      );
    }
    const { username } = result.data;

    const exsitingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exsitingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        sucess: true,
        message: 'Username is unique',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error checking username', error);
    return Response.json(
      {
        sucess: false,
        message: 'Error checking username',
      },
      { status: 500 },
    );
  }
}
