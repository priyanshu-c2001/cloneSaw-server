const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Configure with secure settings and longer timeout
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // Use SSL port
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD // Must be App Password, not regular password
            },
            // Add timeout settings
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
            // Additional settings for cloud hosting
            tls: {
                rejectUnauthorized: true,
                minVersion: "TLSv1.2"
            }
        });

        // Verify connection before sending
        await transporter.verify();

        await transporter.sendMail({
            from: `"Contact Form" <${process.env.EMAIL}>`,
            replyTo: email,
            to: process.env.EMAIL,
            subject: `New message from ${name}`,
            text: message,
            html: `<p><b>Name:</b> ${name}</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Message:</b><br>${message}</p>`
        });

        res.json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error("Email error:", err);

        // Better error handling
        if (err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION') {
            return res.status(503).json({
                message: "Email service temporarily unavailable. Please try again later."
            });
        }

        res.status(500).json({
            message: "Failed to send email. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

module.exports = { sendMail };