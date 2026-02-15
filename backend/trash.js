// export const updateAbout = async (req, res) => {
//   try {
//     const { name, ...aboutData } = req.body;

//     // Update user name if provided
//     if (name) {
//       await User.findOneAndUpdate({}, { name });
//     }

   
//     // upload image to cloudinary if present
//     if (req.file) {
//       const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

//       const uploadResult = await cloudinary.uploader.upload(fileStr, {
//         folder: "dynamite-visuals/profile",
//         resource_type: "image",
//       });

//       aboutData.profileImage = uploadResult.secure_url;
//     }

//     // Update about document
//     const about = await About.findOneAndUpdate({}, aboutData, {
//       new: true, // Return the updated document
//       upsert: true, // Create the document if it doesn't exist
//       runValidators: true,
//     });

//     res.status(200).json({
//       name,
//       ...about.toObject(),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };














// // Mock data for the admin dashboard

// export interface Project {
//   id: string;
//   title: string;
//   category: string;
//   thumbnail: string;
//   description: string;
//   role: string;
//   tools: string[];
//   videoUrl?: string;
//   featured: boolean;
//   createdAt: string;
// }

// export interface Service {
//   id: string;
//   icon: string;
//   title: string;
//   description: string;
//   features: string[];
// }

// export interface Testimonial {
//   id: string;
//   name: string;
//   role: string;
//   avatar: string;
//   content: string;
//   rating: number;
// }

// export interface AboutInfo {
//   name: string;
//   title: string;
//   bio: string;
//   philosophy: string;
//   profileImage: string;
//   stats: {
//     label: string;
//     value: string;
//   }[];
//   tools: string[];
// }

// export interface ContactInfo {
//   email: string;
//   phone: string;
//   whatsapp: string;
//   socialLinks: {
//     platform: string;
//     url: string;
//   }[];
// }

// // Mock Projects Data
// export const mockProjects: Project[] = [
//   {
//     id: "1",
//     title: "Nike 'Rise' Campaign",
//     category: "Video Editing",
//     thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
//     description: "A high-energy brand film showcasing athletic excellence.",
//     role: "Lead Editor",
//     tools: ["Premiere Pro", "After Effects"],
//     videoUrl: "https://example.com/video1",
//     featured: true,
//     createdAt: "2024-01-15",
//   },
//   {
//     id: "2",
//     title: "FinTech App Launch",
//     category: "Motion Graphics",
//     thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
//     description: "Dynamic explainer video for a revolutionary finance app.",
//     role: "Motion Designer",
//     tools: ["After Effects", "Cinema 4D"],
//     videoUrl: "https://example.com/video2",
//     featured: true,
//     createdAt: "2024-02-20",
//   },
//   {
//     id: "3",
//     title: "Cosmos Documentary",
//     category: "Video Editing",
//     thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
//     description: "Award-winning documentary about space exploration.",
//     role: "Editor & Colorist",
//     tools: ["DaVinci Resolve", "Premiere Pro"],
//     videoUrl: "https://example.com/video3",
//     featured: false,
//     createdAt: "2024-03-10",
//   },
//   {
//     id: "4",
//     title: "Character Animation Reel",
//     category: "Animation",
//     thumbnail: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
//     description: "Expressive 3D character animations for gaming.",
//     role: "3D Animator",
//     tools: ["Blender", "Maya"],
//     videoUrl: "https://example.com/video4",
//     featured: true,
//     createdAt: "2024-04-05",
//   },
//   {
//     id: "5",
//     title: "Music Video 'Echoes'",
//     category: "Video Editing",
//     thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
//     description: "Visually stunning music video with seamless transitions.",
//     role: "Director of Edit",
//     tools: ["Premiere Pro", "After Effects"],
//     videoUrl: "https://example.com/video5",
//     featured: false,
//     createdAt: "2024-05-12",
//   },
//   {
//     id: "6",
//     title: "Tech Product Launch",
//     category: "Motion Graphics",
//     thumbnail: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
//     description: "Sleek 3D product visualization and reveal sequence.",
//     role: "Motion Designer",
//     tools: ["Cinema 4D", "After Effects"],
//     videoUrl: "https://example.com/video6",
//     featured: true,
//     createdAt: "2024-06-18",
//   },
// ];

// export const mockServices: Service[] = [
//   {
//     id: "1",
//     icon: "Film",
//     title: "Video Editing",
//     description: "Professional video editing for commercials, films, and social media content.",
//     features: ["Color Grading", "Sound Design", "Transitions", "Storytelling"],
//   },
//   {
//     id: "2",
//     icon: "Sparkles",
//     title: "Motion Graphics",
//     description: "Eye-catching animated graphics and visual effects.",
//     features: ["Logo Animation", "Title Sequences", "Infographics", "Visual Effects"],
//   },
//   {
//     id: "3",
//     icon: "Clapperboard",
//     title: "Animation",
//     description: "2D and 3D character animation and explainer videos.",
//     features: ["Character Animation", "Explainer Videos", "3D Modeling", "Rigging"],
//   },
// ];

// export const mockTestimonials: Testimonial[] = [
//   {
//     id: "1",
//     name: "Sarah Chen",
//     role: "Marketing Director, TechFlow",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//     content: "Peter transformed our product launch video into a viral sensation. The attention to detail and creative vision exceeded our expectations.",
//     rating: 5,
//   },
//   {
//     id: "2",
//     name: "Marcus Johnson",
//     role: "Founder, CreativeStudios",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
//     content: "Working with Peter is a game-changer. Fast turnarounds, incredible quality, and always open to feedback.",
//     rating: 5,
//   },
//   {
//     id: "3",
//     name: "Emma Williams",
//     role: "Content Creator, 2M Followers",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
//     content: "My YouTube engagement doubled after Peter started editing my videos. The pacing, effects, and overall production value are unmatched.",
//     rating: 5,
//   },
// ];

// export const mockAboutInfo: AboutInfo = {
//   name: "Peter Udoh",
//   title: "Video Editor & Motion Designer",
//   bio: "I'm Peter Udoh, a passionate video editor and motion designer. For over 8 years, I've been helping brands, agencies, and creators tell their stories through compelling visual content.",
//   philosophy: "My expertise spans cinematic storytelling, dynamic motion graphics, and precision editing. I believe in creating content that not only looks stunning but also connects with audiences on an emotional level.",
//   profileImage: "https://images.unsplash.com/photo-1599566150163-29194d6b4153?w=800",
//   stats: [
//     { label: "Years Experience", value: "8+" },
//     { label: "Projects Completed", value: "200+" },
//     { label: "Happy Clients", value: "50+" },
//     { label: "Awards Won", value: "12" },
//   ],
//   tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D", "Blender", "Photoshop"],
// };

// // export const mockContactInfo: ContactInfo = {
// //   email: "contact@dynamitevisuals.com",
// //   phone: "+234 703 105 5642",
// //   whatsapp: "+234 703 105 5642",
// //   socialLinks: [
// //     { platform: "YouTube", url: "https://youtube.com/@dynamitevisuals" },
// //     { platform: "Instagram", url: "https://instagram.com/dynamitevisuals" },
// //     { platform: "Facebook", url: "https://facebook.com/dynamitevisuals" },
// //   ],
// // };

// export const projectCategories = ["Video Editing", "Motion Graphics", "Animation", "Color Grading", "Sound Design"];





// import nodemailer from "nodemailer";
// import Contact from "../models/Contact.js";

// export const sendEmail = async (req, res) => {
//   try {
//     const { name, email, subject, message, type } = req.body;

//     // Validate request body
//     if (!name || !email || !message) {
//       return res.status(400).json({ message: "Please fill in all required fields." });
//     }

//     // Save contact to database
//     const contact = new Contact({
//       name,
//       email,
//       subject: subject || "",
//       message,
//       type: type || "general",
//       status: "new",
//     });
//     await contact.save();

//     // Configure Nodemailer transporter
//    const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


//     // Email content
//     const mailOptions = {
//       from: `"${name}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`, // sender address
//       to: process.env.EMAIL_TO || process.env.EMAIL_USER, // list of receivers (admin)
//       subject: subject || `New ${type === "hire" ? "Hire Inquiry" : "Message"} from ${name}`, // Subject line
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Subject: ${subject || "N/A"}
//         Type: ${type || "General Message"}
        
//         Message:
//         ${message}
//       `,
//       html: `
//         <h3>New Message Received</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Subject:</strong> ${subject || "N/A"}</p>
//         <p><strong>Type:</strong> ${type || "General Message"}</p>
//         <br/>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     };

//     // Send email to admin
//     await transporter.sendMail(mailOptions);

//     // Confirmation email to user
//     const confirmationMailOptions = {
//       from: `"${process.env.EMAIL_FROM_NAME || "Dynamite Visuals"}" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "We've received your message!",
//       text: `Hi ${name},\n\nThanks for reaching out! We have received your message and will get back to you as soon as possible.\n\nBest regards,\nDynamite Visuals Team`,
//       html: `
//         <h3>Hi ${name},</h3>
//         <p>Thanks for reaching out! We have received your message and will get back to you as soon as possible.</p>
//         <br/>
//         <p>Best regards,</p>
//         <p><strong>Dynamite Visuals Team</strong></p>
//       `
//     };

//     await transporter.sendMail(confirmationMailOptions);

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Email send error:", error);
//     res.status(500).json({ message: "Failed to send email. Please try again later." });
//   }
// };

// // Get contact statistics for dashboard
// export const getContactStats = async (req, res) => {
//   try {
//     // Get total contacts
//     const totalContacts = await Contact.countDocuments();

//     // Get contacts this month
//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);

//     const contactsThisMonth = await Contact.countDocuments({
//       createdAt: { $gte: startOfMonth },
//     });

//     // Get contacts by type
//     const hireInquiries = await Contact.countDocuments({ type: "hire" });
//     const generalContacts = await Contact.countDocuments({ 
//       type: { $in: ["contact", "general"] } 
//     });

//     res.status(200).json({
//       total: totalContacts,
//       thisMonth: contactsThisMonth,
//       byType: {
//         hire: hireInquiries,
//         contact: generalContacts,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching contact stats:", error);
//     res.status(500).json({ message: "Failed to fetch contact stats" });
//   }
// };

// // Get all contacts (for future admin inbox feature)
// export const getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find()
//       .sort({ createdAt: -1 })
//       .limit(100);

//     res.status(200).json(contacts);
//   } catch (error) {
//     console.error("Error fetching contacts:", error);
//     res.status(500).json({ message: "Failed to fetch contacts" });
//   }
// };
