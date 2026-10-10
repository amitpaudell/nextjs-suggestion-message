import { resend } from '@/lib/resend';
import VerificationEmail from '../../email/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystry Msg || Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { sucess: true, message: ' verification email send sucessfully' };
  } catch (emailError) {
    console.log('Error sending verification Email', emailError);
    return { sucess: false, message: 'Failed to send verification email' };
  }
}
