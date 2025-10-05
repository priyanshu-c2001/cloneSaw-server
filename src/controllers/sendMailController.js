const { Resend } = require('resend');

const sendMail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', 
            replyTo: email,
            to: process.env.EMAIL,
            subject: `New message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        res.json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({
            message: "Failed to send email. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

module.exports = { sendMail };