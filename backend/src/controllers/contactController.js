import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    // Validate request body
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`, // sender address
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // list of receivers (admin)
      subject: subject || `New ${type === "hire" ? "Hire Inquiry" : "Message"} from ${name}`, // Subject line
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject || "N/A"}
        Type: ${type || "General Message"}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Type:</strong> ${type || "General Message"}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    // Send email to admin
    await transporter.sendMail(mailOptions);

    // Confirmation email to user
    const confirmationMailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "Dynamite Visuals"}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We've received your message!",
        text: `Hi ${name},\n\nThanks for reaching out! We have received your message and will get back to you as soon as possible.\n\nBest regards,\nDynamite Visuals Team`,
        html: `
            <h3>Hi ${name},</h3>
            <p>Thanks for reaching out! We have received your message and will get back to you as soon as possible.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>Dynamite Visuals Team</strong></p>
        `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
};
