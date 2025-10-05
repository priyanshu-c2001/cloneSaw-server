const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL,
            subject: `New message from ${name}`,
            text: message,
            html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b><br>${message}</p>`
        });

        res.json({ message: "Message sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send message." });
    }
}

module.exports = { sendMail };