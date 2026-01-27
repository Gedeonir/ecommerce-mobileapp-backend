
function html(token,fe) {
const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: auto;
                }
                .btn {
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #DB3022;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="text-align: center; margin-bottom: 20px; display: flex; justify-content: center; align-items: center;">
                    <h2>Welcome to Market Nest 🎉</h2>
                </div>
                
                <p>Thank you for registering with <strong>Market Nest</strong>.</p>
                <p>Please verify your email to get started.</p>

                <a href="${fe}/verify-email/${token}"
                   class="btn">
                    Verify Email
                </a>

                <p style="margin-top: 30px; font-size: 12px; color: #777;">
                    If you didn’t create this account, you can ignore this email.
                </p>
            </div>
        </body>
        </html>
    `;

    return html;

}
module.exports = html;