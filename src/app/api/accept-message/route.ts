import dbConnect from '@/lib/dbConnect';

import { authOptions } from '../auth/[...nextauth]/option';
import { getServerSession, User } from 'next-auth';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { sucess: false, message: 'Not authenticated' },
      { status: 401 },
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            'Unable to find the user to update the message acceptance status',
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 },
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 },
    );
  }
}
