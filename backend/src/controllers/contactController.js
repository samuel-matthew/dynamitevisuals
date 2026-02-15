import brevo from "@getbrevo/brevo";
import Contact from "../models/Contact.js";

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();

export const sendEmail = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    // Configure API key dynamically to ensure late binding
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

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

    // Prepare email content for Admin
    const adminHtml = `
      <h3>New Message Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || "N/A"}</p>
      <p><strong>Type:</strong> ${type || "General Message"}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Configure Admin Email
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject || `New ${type === "hire" ? "Hire Inquiry" : "Message"} from ${name}`;
    sendSmtpEmail.htmlContent = adminHtml;
    // Sender must be verified in Brevo. Using EMAIL_USER as safe default.
    sendSmtpEmail.sender = { 
      name: name, 
      email: process.env.EMAIL_FROM || process.env.EMAIL_USER 
    };
    sendSmtpEmail.to = [
      { email: process.env.EMAIL_TO || process.env.EMAIL_USER, name: "Admin" }
    ];
    sendSmtpEmail.replyTo = { email: email, name: name };

    // Send email to admin
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Prepare confirmation email content
    const userHtml = `
      <h3>Hi ${name},</h3>
      <p>Thanks for reaching out! We have received your message and will get back to you as soon as possible.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Dynamite Visuals Team</strong></p>
    `;

    // Configure Confirmation Email
    const sendConfirmationEmail = new brevo.SendSmtpEmail();
    sendConfirmationEmail.subject = "We've received your message!";
    sendConfirmationEmail.htmlContent = userHtml;
    sendConfirmationEmail.sender = { 
      name: process.env.EMAIL_FROM_NAME || "Dynamite Visuals", 
      email: process.env.EMAIL_FROM || process.env.EMAIL_USER 
    };
    sendConfirmationEmail.to = [{ email: email, name: name }];

    // Send confirmation email (don't block on error)
    try {
      await apiInstance.sendTransacEmail(sendConfirmationEmail);
    } catch (confirmationError) {
      console.warn("Failed to send confirmation email:", confirmationError.body || confirmationError.message);
    }

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error.body || error.message || error);
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
