const DoctorInformation = require("../../models/doctor");
const SpecialityInformation = require("../../models/speciality");

// Create (POST)
const createDoctorInformation = async (req, res, next) => {
  try {
    const {
      name,
      degree,
      speciality,
      visitFee,
      branch,
      practiceDays,
      phoneNumber,
      yearsOfExperience,
      consultationHours,
      roomNo,
      profilePicture,
      address,
    } = req.body;

    // Create a new doctor entry
    const newDoctor = await DoctorInformation.create({
      name,
      degree,
      speciality,
      visitFee,
      branch,
      practiceDays,
      phoneNumber,
      yearsOfExperience,
      consultationHours,
      roomNo,
      profilePicture,
      address,
    });

    return res.status(201).json({
      message: "Doctor information created successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// Read (GET)
const getDoctorInformation = async (req, res, next) => {
  try {
    // Fetch all doctors from the database
    const doctors = await DoctorInformation.findAll();
    return res.status(200).json({
      message: "Doctors retrieved successfully",
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch doctor information according to doctor id

const getDoctorInformationById = async (req, res, next) => {
  try {
    const { id } = req.params; // Doctor ID from request parameters

    // Find the doctor by ID
    const doctors = await DoctorInformation.findByPk(id);

    if (doctors) {
      return res.status(200).json({
        message: "Doctor information retrieved successfully",
        doctors,
      });
    } else {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
  } catch (error) {
    next(error);
  }
};






// Update (PUT)
const updateDoctorInformation = async (req, res, next) => {
  try {
    const { id } = req.params; // Doctor ID from request parameters
    const {
      name,
      degree,
      speciality,
      visitFee,
      branch,
      practiceDays,
      phoneNumber,
      yearsOfExperience,
      consultationHours,
      roomNo,
      profilePicture,
      address,
    } = req.body;

    // Find the doctor by ID
    const doctor = await DoctorInformation.findByPk(id);
    console.log(doctor)
    if (doctor) {
      // Update the doctor details
      await doctor.update({
        name,
        degree,
        speciality,
        visitFee,
        branch,
        practiceDays,
        phoneNumber,
        yearsOfExperience,
        consultationHours,
        roomNo,
        profilePicture,
        address,
      });

      return res.status(200).json({
        message: "Doctor information updated successfully",
        doctor,
      });
    } else {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete (DELETE)
const deleteDoctorInformation = async (req, res, next) => {
  try {
    const { id } = req.params; // Doctor ID from request parameters

    // Find the doctor by ID
    const doctor = await DoctorInformation.findByPk(id);

    if (doctor) {
      // Delete the doctor
      await doctor.destroy();

      return res.status(200).json({
        message: "Doctor information deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
  } catch (error) {
    next(error);
  }
};



// Getting speciality
const getUniqueSpecialties = async (req, res, next) => {
  try {
    // Fetch all doctors from the database
    const doctors = await DoctorInformation.findAll({
      attributes: ['speciality'], // Select only the speciality field
    });

    // Flatten the nested arrays of specialties and extract unique specialties
    const allSpecialties = doctors.flatMap(doctor => doctor.speciality);
    const uniqueSpecialties = [...new Set(allSpecialties)];

    return res.status(200).json({
      message: "Specialties retrieved successfully",
      specialties: uniqueSpecialties,
    });
  } catch (error) {
    next(error);
  }
};


const getDoctorsBySpeciality = async (req, res, next) => {
  try {
    let { speciality } = req.params;
    
    speciality = speciality.toLowerCase();

    const doctors = await DoctorInformation.findAll();

    // Filter doctors by matching the speciality array
    const filteredDoctors = doctors.filter(doctor =>
      doctor.speciality.some(spec => spec.toLowerCase() === speciality)
    );

    if (filteredDoctors.length > 0) {
      return res.status(200).json({
        message: "Doctors retrieved successfully",
        doctors: filteredDoctors,
      });
    } else {
      return res.status(404).json({
        message: "No doctors found for the given speciality",
      });
    }
  } catch (error) {
    next(error);
  }
};



// Upload SPeciality
const uploadSpecialityWithContent = async (req, res, next) => {
  try {
    const { speciality, specialityContent } = req.body;

    // Ensure the speciality and content are provided
    if (!speciality || !specialityContent) {
      return res.status(400).json({
        message: "Speciality and content are required",
      });
    }

    // Check if the speciality already exists
    const existingSpeciality = await SpecialityInformation.findOne({
      where: { speciality },
    });

    if (existingSpeciality) {
      return res.status(409).json({
        message: `Speciality "${speciality}" already exists.`,
      });
    }

    // Insert the new speciality
    await SpecialityInformation.create({ speciality, specialityContent });

    // Fetch updated list of unique specialties
    const doctors = await SpecialityInformation.findAll({
      attributes: ['speciality'],
    });

    const uniqueSpecialties = doctors.map(doctor => doctor.speciality);

    return res.status(201).json({
      message: "Speciality uploaded and specialties retrieved successfully",
      specialties: uniqueSpecialties,
    });

  } catch (error) {
    next(error);
  }
};


// Getting speciality information with content
const getSpecialityInformation = async (req, res, next) => {
  try {
    const { content } = req.query; // Expect query=yes or query=no

    // Fetch data based on query parameter
    const doctors = await SpecialityInformation.findAll({
      attributes: content === 'yes' 
        ? ['id', 'speciality', 'specialityContent'] 
        : ['id', 'speciality'],
    });

    const specialties = doctors.map(doctor => {
      if (content === 'yes') {
        return {
          id: doctor.id,
          speciality: doctor.speciality,
          specialityContent: doctor.specialityContent,
        };
      }
      return {
        id: doctor.id,
        speciality: doctor.speciality,
      };
    });

    return res.status(200).json({
      message: "Specialty information retrieved successfully",
      specialties,
    });

  } catch (error) {
    next(error);
  }
};




const getContentAccordingToSpeciality = async (req, res, next) => {
  try {
    const { content, speciality } = req.query;

    // Build query condition for specialty if provided
    const condition = speciality ? { speciality: speciality.trim() } : {};

    // Fetch data based on query parameters
    const doctors = await SpecialityInformation.findAll({
      where: condition,
      attributes: content === 'yes' 
        ? ['speciality', 'specialityContent'] 
        : ['speciality'],
    });

    // Format the response based on query
    const specialties = doctors.map(doctor => {
      if (content === 'yes') {
        return {
          speciality: doctor.speciality,
          specialityContent: doctor.specialityContent,
        };
      }
      return doctor.speciality;
    });

    return res.status(200).json({
      message: "Specialty information retrieved successfully",
      specialties,
    });

  } catch (error) {
    next(error);
  }
};




const updateSpecialityWithContent = async (req, res, next) => {
  try {
    const {id, speciality, specialityContent } = req.body;

    // Ensure all required fields are provided
    if (!id || !speciality || !specialityContent) {
      return res.status(400).json({
        message: "ID, Speciality, and content are required.",
      });
    }

    // Check if the speciality exists
    const existingSpeciality = await SpecialityInformation.findOne({
      where: { id },
    });

    if (!existingSpeciality) {
      return res.status(404).json({
        message: "Speciality not found.",
      });
    }

    // Update the speciality and content
    await existingSpeciality.update({ speciality, specialityContent });

    return res.status(200).json({
      message: "Speciality updated successfully."
    });

  } catch (error) {
    next(error);
  }
};




module.exports = {
  createDoctorInformation,
  getDoctorInformation,
  updateDoctorInformation,
  deleteDoctorInformation,
  getDoctorInformationById,
  getDoctorsBySpeciality,
  getUniqueSpecialties,
  uploadSpecialityWithContent,
  getSpecialityInformation,
  getContentAccordingToSpeciality,
  updateSpecialityWithContent

};
