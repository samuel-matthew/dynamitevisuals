import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

export const sendEmail = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    // Validate request body
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Save contact to database
    const contact = new Contact({
      name,
      email,
      subject: subject || "",
      message,
      type: type || "general",
      status: "new",
    });
    await contact.save();

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

// Get contact statistics for dashboard
export const getContactStats = async (req, res) => {
  try {
    // Get total contacts
    const totalContacts = await Contact.countDocuments();

    // Get contacts this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const contactsThisMonth = await Contact.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Get contacts by type
    const hireInquiries = await Contact.countDocuments({ type: "hire" });
    const generalContacts = await Contact.countDocuments({ 
      type: { $in: ["contact", "general"] } 
    });

    res.status(200).json({
      total: totalContacts,
      thisMonth: contactsThisMonth,
      byType: {
        hire: hireInquiries,
        contact: generalContacts,
      },
    });
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({ message: "Failed to fetch contact stats" });
  }
};

// Get all contacts (for future admin inbox feature)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};
