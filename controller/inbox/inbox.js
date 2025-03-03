const HospitalContactInfo = require("../../models/hospitalContactInfo");
const Inquery = require("../../models/inbox");
const Message = require("../../models/message");



// Controller to add a new message
const addMessage = async (req, res, next) => {
    try {
        const { name,
            email,
            phone,
            message } = req.body;

        // Create a new message entry
        const newMessage = await Inquery.create({
           name,
           email,
           phone,
           message,
        });

        return res.status(200).json({
            message: "Inquery added successfully",
            messageDetails: newMessage,
        });
    } catch (error) {
        next(error);
    }
};


const addContactMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Find the last message entry to get the last ID
        const lastMessage = await Message.findOne({
            order: [['id', 'DESC']], // Order by ID in descending order to get the last entry
        });

        // Calculate the new ID
        const newId = lastMessage ? lastMessage.id + 1 : 1;

        // Create a new message entry with the new ID
        const newMessage = await Message.create({
            id: newId, // Manually set the ID
            name,
            email,
            message,
        });

        return res.status(200).json({
            message: "Message added successfully",
            messageDetails: newMessage,
        });
    } catch (error) {
        next(error);
    }
};



// Controller to get all messages
const getMessages = async (req, res, next) => {
    try {
        // Fetch all messages from the database
        const messagesData = await Inquery.findAll();

        return res.status(200).json({
            message: "Inquery retrieved successfully",
            messages: messagesData,
        });
    } catch (error) {
        next(error);
    }
};

const getContactMessage = async (req, res, next) => {
    try {
        // Fetch all messages from the database
        const messagesData = await Message.findAll();

        return res.status(200).json({
            message: "Inquiry retrieved successfully",
            messages: messagesData,
        });
    } catch (error) {
        next(error);
    }
};

// Controller to update a message by id
const updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { clientName, clientEmail, clientMessage } = req.body;

        // Find the message entry by id
        const existingMessage = await Inquery.findOne({
            where: { id },
        });

        if (!existingMessage) {
            return res.status(404).json({
                message: `The message with id '${id}' does not exist.`,
            });
        }

        // Update the message with new values
        existingMessage.clientName = clientName || existingMessage.clientName;
        existingMessage.clientEmail = clientEmail || existingMessage.clientEmail;
        existingMessage.clientMessage = clientMessage || existingMessage.clientMessage;

        // Save the updated message
        await existingMessage.save();

        return res.status(200).json({
            message: `Message with id '${id}' updated successfully.`,
            messageDetails: existingMessage,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the message ID from the URL parameters

        // Find the message entry by ID
        const existingMessage = await Inquery.findOne({
            where: { id },
        });

        if (!existingMessage) {
            return res.status(404).json({
                message: `The inquiry with id '${id}' does not exist.`,
            });
        }

        // Delete the message entry
        await existingMessage.destroy();

        return res.status(200).json({
            message: `Inquiry with id '${id}' deleted successfully.`,
        });
    } catch (error) {
        next(error);
    }
};


const deleteContactMessage = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the message ID from the URL parameters

        // Find the message entry by ID
        const existingMessage = await Message.findOne({
            where: { id },
        });

        if (!existingMessage) {
            return res.status(404).json({
                message: `The message with id '${id}' does not exist.`,
            });
        }

        // Delete the message entry
        await existingMessage.destroy();

        return res.status(200).json({
            message: `Message with id '${id}' deleted successfully.`,
        });
    } catch (error) {
        next(error);
    }
};







// Controller functions for contact information
const upsertHospitalContactInfo = async (req, res) => {
    try {
      const { title, description, address, phoneNumbers, email, businessHours } = req.body;
  
      // Validate required fields
      if (!title || !description || !address || !phoneNumbers || !email || !businessHours) {
        return res.status(400).json({
          message: "Please provide all required fields: title, description, address, phoneNumbers, email, and businessHours.",
        });
      }
  
      // Find existing entry
      const existingData = await HospitalContactInfo.findOne();
  
      let hospitalInfoData;
  
      if (existingData) {
        // Update existing data
        hospitalInfoData = await existingData.update({
          title,
          description,
          address,
          phoneNumbers,
          email,
          businessHours,
        });
        return res.status(200).json({
          message: "Hospital contact information successfully updated!",
          data: hospitalInfoData,
        });
      } else {
        // Create new data
        hospitalInfoData = await HospitalContactInfo.create({
          title,
          description,
          address,
          phoneNumbers,
          email,
          businessHours,
        });
        return res.status(201).json({
          message: "Hospital contact information successfully added!",
          data: hospitalInfoData,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while processing hospital information!",
        error: error.message,
      });
    }
  };


  const getHospitalContactInfo = async (req, res) => {
    try {
      const hospitalInfo = await HospitalContactInfo.findOne();
  
      if (!hospitalInfo) {
        return res.status(404).json({
          message: "Hospital information not found.",
        });
      }
  
      // Parse phoneNumbers explicitly before sending the response
      const hospitalData = hospitalInfo.get({ plain: true });
      hospitalData.phoneNumbers = JSON.parse(hospitalData.phoneNumbers);
  
      return res.status(200).json({
        message: "Hospital information fetched successfully!",
        data: hospitalData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while fetching hospital information.",
        error: error.message,
      });
    }
  };
  
  
  

module.exports = {
    addMessage,
    getMessages,
    updateMessage,
    deleteMessage,
    addContactMessage,
    getContactMessage,
    deleteContactMessage,
    upsertHospitalContactInfo,
    getHospitalContactInfo
};
