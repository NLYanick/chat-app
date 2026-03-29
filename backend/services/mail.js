const { BrevoClient, BrevoError } = require("@getbrevo/brevo");

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 30
});

const primaryColor = '#242424';
const secondaryColor = '#8e51ff';

function handleError(error) {
  if (error instanceof BrevoError) {
    console.error(`API error ${error.statusCode}:`, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
}

async function sendEmail(users, htmlContent) {
  try {    
    await client.transactionalEmails.sendTransacEmail({
      subject: "Reset Your Password",
      sender: { name: "Chat App", email: process.env.SENDER_EMAIL },
      to: users.map(user => ({ email: user.email })),
      htmlContent
    });
  } catch (error) {
    handleError(error);
  }
}

async function sendResetPasswordEmail(user) {
  await sendEmail([user],
    ` <html> 
        <body style="font-family: Arial, sans-serif; background-color: ${primaryColor}; color: white; margin: 0; padding: 0;"> 
          <div style="text-align: center; padding-top: 30px;">
            <h1 style="background-color: ${secondaryColor}; padding: 15px 0;">Reset Password</h1>
            <div style="margin-top: 40px;">
              <p style="margin-bottom: 30px">Click the link below to reset you password:</p>
              <a href="${process.env.FRONTEND_URL}/reset-password?token=${user.password_reset_token}" style="background-color: ${secondaryColor}; border-radius: 10px; padding: 8px 16px; text-decoration: none; color: white;">
                Reset password
              </a>
            </div>
          </div>

          <hr style="height: 2px; border-width: 0; margin-top: 50px; background-color: #8e51ff">
        </body> 
      </html>
    `.trim()
  );
}


module.exports = { sendResetPasswordEmail };