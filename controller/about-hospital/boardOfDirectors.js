const BoardOfDirector = require("../../models/boardOfDirector");


const addBoardOfDirector = async (req, res) => {
  try {
    const { description, designation, imageUrl, name } = req.body;

    if (!description || !designation || !imageUrl || !name) {
      return res.status(400).json({
        message: "Please provide all required fields: description, designation, imageUrl, and name.",
      });
    }

    const newData = await BoardOfDirector.create({
      description,
      designation,
      imageUrl,
      name,
    });

    return res.status(201).json({
      message: "Information successfully added!",
      data: newData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding hospital information!",
      error: error.message,
    });
  }
};




const getBoardOfDirector = async (req, res) => {
    try {
      const data = await BoardOfDirector.findAll();
  
      if (data.length === 0) {
        return res.status(404).json({
          message: "No hospital information found!",
        });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching hospital information!",
        error: error.message,
      });
    }
  };
  




const updateBoardOfDirector = async (req, res) => {
    try {
      const { id } = req.params;
      const { description, designation, imageUrl, name } = req.body;
  
      const existingEntry = await BoardOfDirector.findByPk(id);
  
      if (!existingEntry) {
        return res.status(404).json({ message: "Hospital entry not found!" });
      }
  
      existingEntry.description = description || existingEntry.description;
      existingEntry.designation = designation || existingEntry.designation;
      existingEntry.imageUrl = imageUrl || existingEntry.imageUrl;
      existingEntry.name = name || existingEntry.name;
  
      await existingEntry.save();
  
      return res.status(200).json({
        message: "Information successfully updated!",
        data: existingEntry,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating hospital information!",
        error: error.message,
      });
    }
  };


  const deleteBoardOfDirector = async (req, res) => {
    try {
      const { id } = req.params;
  
      const existingEntry = await BoardOfDirector.findByPk(id);
  
      if (!existingEntry) {
        return res.status(404).json({ message: "Entry not found!" });
      }
  
      await existingEntry.destroy();
  
      return res.status(200).json({ message: "Entry successfully deleted!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while deleting the entry!",
        error: error.message,
      });
    }
  };
  
  

  module.exports = {
    addBoardOfDirector,
    updateBoardOfDirector,
    getBoardOfDirector,
    deleteBoardOfDirector
  };