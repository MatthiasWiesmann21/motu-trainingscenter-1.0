import React from 'react';

const EmailVerified = ({ userEmail , loginUrl, unsubscribeUrl } : any ) => {
  return (
    `<div className="container">
      <div className="header">
        <h1>Clubyte</h1>
      </div>
      <div className="content">
        <h2>Email Verified Successfully!</h2>
        <p>Dear User,</p>
        <p>Thank you for verifying your email address. Your email <strong>{userEmail}</strong> has been successfully verified.</p>
        <a href={loginUrl} className="button">Go to Dashboard</a>
      </div>
      <div className="footer">
        <p>If you did not verify this email, please contact our support team immediately.</p>
        <p>Clubyte &copy; 2024. All rights reserved.</p>
        <p><a href={unsubscribeUrl}>Unsubscribe</a></p>
      </div>
      <style jsx>
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
        }

        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #0a0118;
          border-radius: 10px 10px 0 0;
        }

        .header h1 {
          color: #ffffff;
          margin: 10px 0;
          font-size: 24px;
        }

        .content {
          padding: 20px;
          text-align: center;
          color: #333;
        }

        .content h2 {
          color: #0a0118;
          font-size: 22px;
        }

        .content p {
          font-size: 16px;
          margin: 15px 0;
        }

        .button {
          display: inline-block;
          padding: 12px 25px;
          font-size: 16px;
          color: #ffffff;
          background-color: #f01b8b;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
        }

        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #999;
        }

        .footer p {
          margin: 5px 0;
        }

        .footer a {
          color: #f01b8b;
          text-decoration: none;
        }
      </style>
    </div>`
  );
};

export default EmailVerified;
