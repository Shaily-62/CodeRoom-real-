import { resend, emailConfig } from "../config/email.js";

// Send a project invitation email
export const sendProjectInvitationEmail = async ({
  recipientEmail,
  inviterName,
  projectName,
  role,
  invitationToken,
}) => {
  const invitationLink = `${emailConfig.frontendUrl}/invite/accept?token=${invitationToken}`;

  const { data, error } = await resend.emails.send({
    from: emailConfig.from,
    to: [recipientEmail],
    subject: `${inviterName} invited you to collaborate on ${projectName}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 32px;
        color: #29352F;
        background-color: #F5F3EE;
        border-radius: 12px;
      ">
        <h1 style="color: #718879;">
          Welcome to CodeRoom!
        </h1>

        <p>Hello,</p>

        <p>
          <strong>${inviterName}</strong> has invited you
          to collaborate on the project
          <strong>${projectName}</strong>.
        </p>

        <p>
          Your assigned role:
          <strong>${role}</strong>
        </p>

        <div style="margin: 32px 0;">
          <a
            href="${invitationLink}"
            style="
              background-color: #718879;
              color: white;
              padding: 14px 24px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
            "
          >
            Accept Invitation
          </a>
        </div>

        <p>
          This invitation expires in 7 days.
          Please sign in or create an account using
          the email address that received this invitation.
        </p>

        <p style="font-size: 13px; color: #737E76;">
          If you were not expecting this invitation,
          you can safely ignore this email.
        </p>

        <hr style="border: 0; border-top: 1px solid #D9E2D9;" />

        <p style="font-size: 12px; color: #737E76;">
          CodeRoom — Your team's collaborative development workspace.
        </p>
      </div>
    `,
    text: `
      Welcome to CodeRoom!

      ${inviterName} invited you to collaborate on ${projectName}.

      Your role: ${role}

      Accept your invitation here:
      ${invitationLink}

      This invitation expires in 7 days.
    `,
  });

  if (error) {
    throw Object.assign(
      new Error(error.message || "Failed to send invitation email"),
      { statusCode: 502 },
    );
  }

  return data;
};
