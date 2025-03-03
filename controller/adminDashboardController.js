const Appointment = require("../models/appointment");
const DoctorsInformation = require("../models/doctor");
const BoardOfDirector = require("../models/boardOfDirector");
const SpecialityInformation = require("../models/speciality");
const TestList = require("../models/testList");
const Inquery = require("../models/inbox");
const Message = require("../models/message");
const AuthorityUser = require("../models/authorityUser");

const getDoctorDashboardData = async (req, res) => {
    try {
        // Get the logged-in doctor's ID from the request
        const doctorId = req.query.doctorId;

        // Fetch the logged-in doctor's specialties
        const loggedInDoctor = await DoctorsInformation.findOne({
            where: {
                id: doctorId,
            },
            attributes: ["speciality"], // Fetch only the specialty field
        });

        if (!loggedInDoctor) {
            return res.status(404).json({
                message: "Doctor not found!",
            });
        }

        const loggedInDoctorSpecialities = loggedInDoctor.speciality;

        // Fetch all doctors
        const allDoctors = await DoctorsInformation.findAll({
            attributes: ["id", "name", "speciality", "visitFee", "profilePicture", "degree"],
        });

        // Function to filter doctors by specialty
        const getDoctorsBySpeciality = (speciality) => {
            return allDoctors.filter(doctor =>
                doctor.speciality.some(spec => spec.toLowerCase() === speciality.toLowerCase())
            );
        };

        // Get doctors with matching specialties
        const doctorsWithMatchingSpecialities = [];
        loggedInDoctorSpecialities.forEach(speciality => {
            const matchedDoctors = getDoctorsBySpeciality(speciality);
            doctorsWithMatchingSpecialities.push(...matchedDoctors);
        });

        // Remove duplicates (in case a doctor matches multiple specialties)
        const uniqueDoctorsWithMatchingSpecialities = [...new Set(doctorsWithMatchingSpecialities)];

        // Get today's date in the local timezone
        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Fetch today's pending appointments for the logged-in doctor
        const pendingAppointments = await Appointment.findAll({
            where: {
                doctor: doctorId, // Filter by the logged-in doctor's ID
                status: "pending", // Filter by pending status
            }
        });

        // Filter pending appointments for today (using local timezone)
        const todaysPendingAppointments = pendingAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date + 'T00:00:00Z'); // Treat appointment.date as UTC
            const localAppointmentDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
            return localAppointmentDate === formattedToday;
        });

        // Fetch all appointments with status "complete" for the specific doctor and include doctor information
        const completeAppointments = await Appointment.findAll({
            where: {
                status: "complete",
                doctor: doctorId, // Filter by the logged-in doctor's ID
            },
            include: [
                {
                    model: DoctorsInformation,
                    as: "doctorInfo",
                    attributes: ["visitFee"], // Include only the visitFee field
                }
            ],
        });

        // Extract unique patients based on their email addresses
        const uniquePatients = new Set();
        let totalRevenue = 0;

        completeAppointments.forEach(appointment => {
            uniquePatients.add(appointment.appointmentBookedBy.userEmail);

            // Add the visit fee of the doctor to the total revenue
            if (appointment.doctorInfo && appointment.doctorInfo.visitFee) {
                totalRevenue += appointment.doctorInfo.visitFee;
            }
        });

        // Get the count of unique patients
        const totalPatients = uniquePatients.size;

        // Fetch the total number of doctors
        const totalDoctors = await DoctorsInformation.count();

        // Fetch the total number of specialties
        const totalSpecialities = await SpecialityInformation.count();

        // Fetch all test lists
        const testLists = await TestList.findAll();

        // Calculate the total number of available test items
        let totalTestItems = 0;
        testLists.forEach(testList => {
            if (testList.items) {
                // Parse the items string into an array
                const itemsArray = JSON.parse(testList.items);
                if (Array.isArray(itemsArray)) {
                    totalTestItems += itemsArray.length;
                }
            }
        });

        // Fetch the total number of appointments for the specific doctor (all statuses)
        const totalAppointments = await Appointment.count({
            where: {
                doctor: doctorId, // Filter by the logged-in doctor's ID
            }
        });

        // Fetch the total number of pending appointments for the specific doctor
        const totalPendingAppointments = await Appointment.count({
            where: {
                status: "pending",
                doctor: doctorId, // Filter by the logged-in doctor's ID
            }
        });

        // Fetch the total number of complete appointments for the specific doctor
        const totalCompleteAppointments = await Appointment.count({
            where: {
                status: "complete",
                doctor: doctorId, // Filter by the logged-in doctor's ID
            }
        });

        // Return the data in the response
        return res.status(200).json({
            message: "Dashboard data retrieved successfully!",
            data: {
                totalPatients,
                totalDoctors,
                totalRevenue,
                totalSpecialities,
                totalTestItems,
                totalAppointments, // Total number of appointments for the specific doctor (all statuses)
                totalPendingAppointments, // Total number of pending appointments for the specific doctor
                totalCompleteAppointments, // Total number of complete appointments for the specific doctor
                doctorsWithMatchingSpecialities: uniqueDoctorsWithMatchingSpecialities, // List of doctors with matching specialties
                todaysPendingAppointments, // Today's pending appointments for the logged-in doctor
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving home page data!",
            error: error.message,
        });
    }
};


// Getting superadmin dashboard data.......................................................

const getSuperAdminDashboardData = async (req, res) => {
    try {

        const superAdminUsers = await AuthorityUser.findAll({where: {role: "super-admin"}});

        const adminUsers = await AuthorityUser.findAll({where: {role: "admin"}});


        // Get today's date in the local timezone
        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Fetch today's pending appointments for the logged-in doctor
        const pendingAppointments = await Appointment.findAll({
            where: {
                status: "pending", // Filter by pending status
            }
        });

        // Filter pending appointments for today (using local timezone)
        const todaysPendingAppointments = pendingAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date + 'T00:00:00Z'); // Treat appointment.date as UTC
            const localAppointmentDate = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
            return localAppointmentDate === formattedToday;
        });

        // Fetch all appointments with status "complete" for the specific doctor and include doctor information
        const completeAppointments = await Appointment.findAll({
            where: {
                status: "complete",
            },
            include: [
                {
                    model: DoctorsInformation,
                    as: "doctorInfo",
                    attributes: ["visitFee"], // Include only the visitFee field
                }
            ],
        });

        // Extract unique patients based on their email addresses
        const uniquePatients = new Set();
        let totalRevenue = 0;

        completeAppointments.forEach(appointment => {
            uniquePatients.add(appointment.appointmentBookedBy.userEmail);

            // Add the visit fee of the doctor to the total revenue
            if (appointment.doctorInfo && appointment.doctorInfo.visitFee) {
                totalRevenue += appointment.doctorInfo.visitFee;
            }
        });

        // Get the count of unique patients
        const totalPatients = uniquePatients.size;

        // Fetch the total number of doctors
        const totalDoctors = await DoctorsInformation.count();

        // Fetch the total number of board of directors
        const totalDirectors = await BoardOfDirector.count();

        // Fetch the total number of specialties
        const totalSpecialities = await SpecialityInformation.count();

        // Fetch all test lists
        const testLists = await TestList.findAll();

        // Calculate the total number of available test items
        let totalTestItems = 0;
        testLists.forEach(testList => {
            if (testList.items) {
                // Parse the items string into an array
                const itemsArray = JSON.parse(testList.items);
                if (Array.isArray(itemsArray)) {
                    totalTestItems += itemsArray.length;
                }
            }
        });

        // Fetch the total number of appointments for the specific doctor (all statuses)
        const totalAppointments = await Appointment.count();

        // Fetch the total number of pending appointments for the specific doctor
        const totalPendingAppointments = await Appointment.count({
            where: {
                status: "pending",
            }
        });

        // Fetch the total number of complete appointments for the specific doctor
        const totalCompleteAppointments = await Appointment.count({
            where: {
                status: "complete",
            }
        });

        // Fetch the two latest messages
        const latestMessages = await Message.findAll({
            order: [['createdAt', 'DESC']], // Order by createdAt in descending order
            limit: 2, // Limit to 2 messages
        });

        // Fetch the two latest inquiries
        const latestInquiries = await Inquery.findAll({
            order: [['createdAt', 'DESC']], // Order by createdAt in descending order
            limit: 2, // Limit to 2 inquiries
        });

        // Return the data in the response
        return res.status(200).json({
            message: "Super Admin Dashboard data retrieved successfully!",
            data: {
                totalPatients,
                totalDoctors,
                totalDirectors,
                totalRevenue,
                totalSpecialities,
                totalTestItems,
                totalAppointments, // Total number of appointments for the specific doctor (all statuses)
                totalPendingAppointments, // Total number of pending appointments for the specific doctor
                totalCompleteAppointments, // Total number of complete appointments for the specific doctor
                todaysPendingAppointments, // Today's pending appointments for the logged-in doctor
                latestMessages, // Two latest messages
                latestInquiries, // Two latest inquiries
                superAdminUsers,
                adminUsers
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving home page data!",
            error: error.message,
        });
    }
};


module.exports = {
    getDoctorDashboardData,
    getSuperAdminDashboardData
};