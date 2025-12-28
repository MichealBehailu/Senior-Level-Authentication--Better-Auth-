import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type VerificationEmailParams = {
  user: {
    email: string;
    name?: string | null;
  };
  url: string;
  token: string;
};

export async function sendVerificationEmail({
  user,
  url,
}: VerificationEmailParams) {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Verify your email</h2>
      <p>Hello${user.name ? ` ${user.name}` : ""},</p>
      <p>Please verify your email by clicking the button below:</p>
      <a
        href="${url}"
        style="
          display: inline-block;
          padding: 10px 16px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Verify Email
      </a>
      <p>If you didn’t create this account, ignore this email.</p>
    </div>
  `;
  
  console.log("📧 Sending verification email to:", user.email);

  try {
    await resend.emails.send({
      from: "Resend <no-reply@resend.dev>", // free Resend domain
      to: user.email,
      subject: "Verify your email",
      html,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Verification email failed");
  }
}
