export function generateEmailTemplatePinCode(userEmail, pinCode) {
    return `
    <html>
      <head>
        <style>
          .container {
            width: 80%;
            margin: auto;
            padding: 10px;
            border: 1px solid #ddd;
            font-family: Arial, sans-serif;
          }
          .header {
            background-color: #f7f7f7;
            padding: 10px 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
          .content {
            padding: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            padding: 10px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Your PIN Code</h2>
          </div>
          <div class="content">
            <p>Dear ${userEmail},</p>
            <p>Your PIN code is: <strong>${pinCode}</strong></p>
            <p>Please use this PIN code to proceed with your transaction or login.</p>
          </div>
          <div class="footer">
            <p>If you did not request this PIN code, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}