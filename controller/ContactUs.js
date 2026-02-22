import Contact from "../model/ContactUs.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });

  } catch (error) {
    console.error("Error creating contact:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllContacts = async (req, res) => {
  try {

    const contacts = await Contact.find()
      .populate("response.respondedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });

  } catch (error) {

    console.error("Error fetching contacts:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOpenContacts = async (req, res) => {
  try {

    const contacts = await Contact.find({ status: "open" })
      .populate("response.respondedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });

  } catch (error) {

    console.error("Error fetching open contacts:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getClosedContacts = async (req, res) => {
  try {

    const contacts = await Contact.find({ status: "closed" })
      .populate("response.respondedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });

  } catch (error) {

    console.error("Error fetching closed contacts:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateContactStatus = async (req, res) => {
  try {

    const { contactId, status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated",
      contact,
    });

  } catch (error) {

    console.error("Error updating status:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const replyContact = async (req, res) => {
  try {

    const { contactId, message } = req.body;

    const adminId = req.user?.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Reply message required",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      {
        response: {
          message,
          respondedBy: adminId,
          respondedAt: new Date(),
        },
        // status: "closed",
      },
      { new: true }
    ).populate("response.respondedBy", "name email");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact,
    });

  } catch (error) {

    console.error("Error replying contact:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};