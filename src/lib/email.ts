import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) => {
  await resend.emails.send({
    from: "Your App <onboarding@resend.dev>",
    to: user.email,
    subject: "Verify your email address",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};

export const sendResetPassword = async ({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) => {
  await resend.emails.send({
    from: "Your App <onboarding@resend.dev>",
    to: user.email,
    subject: "Reset your password",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
};
