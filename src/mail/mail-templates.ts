export const verificationMail = (code: string, appUrl: string, to: string): string =>{
    return (
        `
      <p>Hola 👋</p>
      <p>Tu código de verificación es:</p>
      <h2 style="letter-spacing: 2px">${code}</h2>
      <p>O haz click aquí:</p>
      <a href="${appUrl}/auth/verify?code=${code}&email=${encodeURIComponent(to)}">
        Verificar correo
      </a>
    `
    )
}

export const forgotPasswordMail = (resetLink: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello 👋</p>
      <p>You have requested a password reset.</p>
      <p>Click the button below to reset your password:</p>
      <a 
        href="${resetLink}" 
        style="
          display: inline-block;
          padding: 12px 24px;
          margin: 10px 0;
          background-color: #4F46E5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
};

export const deletionWarningMail = (appUrl: string):string => {
    return (
        `
      <p>Hello 👋</p>
      <p>Your account is about to be deleted forever</p>
      
      <p>Click here to reactivate your account:</p>
      <a href="${appUrl}/whatever">
        Verificar correo
      </a>
    `
    )
}

export const emailChangeMail = (
  confirmLink: string,
  newEmail: string,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello 👋</p>

      <p>
        You have requested to change the email associated with your account to:
      </p>

      <p style="font-weight: bold;">${newEmail}</p>

      <p>Please confirm this change by clicking the button below:</p>

      <a
        href="${confirmLink}"
        style="
          display: inline-block;
          padding: 12px 24px;
          margin: 10px 0;
          background-color: #16A34A;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Confirm new email
      </a>

      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        If you didn’t request this change, please ignore this email.
        Your current email will remain unchanged.
      </p>
    </div>
  `;
};
