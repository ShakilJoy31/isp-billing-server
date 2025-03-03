const { Sequelize } = require("sequelize"); // Import Sequelize
const Appointment = require("../../models/appointment");
const DoctorInformation = require("../../models/doctor");
const User = require("../../models/User");

// Controller to add a new appointment
const addAppointment = async (req, res, next) => {
    try {
        const { appointmentBookedBy, branch, date, time, status, doctor, specialty, userContactNumber, userNote } = req.body;

        // Create a new appointment entry
        const newAppointment = await Appointment.create({
            appointmentBookedBy,
            branch,
            date,
            time,
            status,
            doctor,
            specialty,
            userContactNumber,
            userNote,
        });

        return res.status(200).json({
            message: "Appointment added successfully",
            appointmentDetails: newAppointment,
        });
    } catch (error) {
        next(error);
    }
};

const getAppointments = async (req, res, next) => {
    try {
        const appointmentsData = await Appointment.findAll({
            include: [
                {
                    model: DoctorInformation,
                    as: "doctorInfo",
                }
            ],
        });

        return res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments: appointmentsData,
        });
    } catch (error) {
        next(error);
    }
};

// Get appointments according to the doctor.
const getAppointmentsAccordingToDoctor = async (req, res, next) => {
    try {
      const doctorId = req.params.id;
      const { status } = req.query;
  
      // Define the query filter
      const query = {
        where: {
          doctor: doctorId,
        },
        include: [
          {
            model: DoctorInformation,
            as: "doctorInfo",
          },
        ],
      };
  
      // Add status filter if it's provided
      if (status) {
        query.where.status = status;
      }
  
      const appointmentsData = await Appointment.findAll(query);
  
      if (!appointmentsData.length) {
        return res.status(404).json({
          message: "No appointments found for you!",
        });
      }
  
      return res.status(200).json({
        message: "Appointments retrieved successfully",
        appointments: appointmentsData,
      });
    } catch (error) {
      next(error);
    }
  };
  



// Controller to update an appointment by id
const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { appointmentBookedBy, branch, status, date, doctor, specialty, userContactNumber, userNote } = req.body;

        // Find the appointment entry by id
        const existingAppointment = await Appointment.findOne({
            where: { id },
        });

        if (!existingAppointment) {
            return res.status(404).json({
                message: `The appointment with id '${id}' does not exist.`,
            });
        }

        // Update the appointment with new values
        existingAppointment.appointmentBookedBy = appointmentBookedBy || existingAppointment.appointmentBookedBy;
        existingAppointment.branch = branch || existingAppointment.branch;
        existingAppointment.status = status || existingAppointment.status;
        existingAppointment.date = date || existingAppointment.date;
        existingAppointment.doctor = doctor || existingAppointment.doctor;
        existingAppointment.specialty = specialty || existingAppointment.specialty;
        existingAppointment.userContactNumber = userContactNumber || existingAppointment.userContactNumber;
        existingAppointment.userNote = userNote || existingAppointment.userNote;

        // Save the updated appointment
        await existingAppointment.save();

        return res.status(200).json({
            message: `Appointment with id '${id}' updated successfully.`,
            appointmentDetails: existingAppointment,
        });
    } catch (error) {
        next(error);
    }
};

// Controller to delete an appointment by id
const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the appointment ID from the URL parameters

        // Find the appointment entry by ID
        const existingAppointment = await Appointment.findOne({
            where: { id },
        });

        if (!existingAppointment) {
            return res.status(404).json({
                message: `The appointment with id '${id}' does not exist.`,
            });
        }

        // Delete the appointment entry
        await existingAppointment.destroy();

        return res.status(200).json({
            message: `Appointment with id '${id}' deleted successfully.`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
    getAppointmentsAccordingToDoctor
};
