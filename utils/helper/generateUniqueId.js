const { Sequelize } = require("sequelize");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");

const generateUniqueEmployeeId = async (fullName) => {
  
  // Split the full name into parts
  const nameParts = fullName.trim().split(' ');
  
  // Get first and last name (if available)
  const firstName = nameParts[0]?.toLowerCase() || 'user';
  const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || '';
  
  // Create base userId using first name and last name initial
  let baseUserId;
  if (lastName && lastName !== firstName) {
    // Use first name + first letter of last name
    baseUserId = `${firstName}${lastName.charAt(0)}`;
  } else {
    // If no last name or same as first name, use only first name
    baseUserId = firstName;
  }
  
  // Clean the baseUserId (remove special characters, keep only letters)
  baseUserId = baseUserId.replace(/[^a-z]/g, '');
  
  // If baseUserId is empty after cleaning, use 'user'
  if (!baseUserId) {
    baseUserId = 'user';
  }
  
  let userId = `${baseUserId}@ringtel`;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    // Check if the userId already exists in the database
    const existingUser = await AuthorityInformation.findOne({ where: { userId } });
    if (!existingUser) {
      isUnique = true;
    } else {
      // If the userId exists, append a number and try again
      userId = `${baseUserId}${counter}@ringtel`;
      counter++;
      
      // Safety check to prevent infinite loop
      if (counter > 1000) {
        throw new Error('Could not generate unique userId after 1000 attempts');
      }
    }
  }
  
  return userId;
};


const generateUniqueUserId = async (fullName) => {
  // Split the full name into parts
  const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);
  
  // Get first name (first part)
  const firstName = nameParts[0]?.toLowerCase() || 'user';
  
  // Create base userId using only the first name
  let baseUserId = firstName;
  
  // Clean the baseUserId (remove special characters, keep only letters)
  baseUserId = baseUserId.replace(/[^a-z]/g, '');
  
  // If baseUserId is empty after cleaning, use 'user'
  if (!baseUserId) {
    baseUserId = 'user';
  }
  
  // Find how many existing users have this base userId
  const existingUsers = await ClientInformation.findAll({
    where: {
      userId: {
        [Sequelize.Op.like]: `${baseUserId}%@ringtel`
      }
    }
  });
  
  // Extract numbers from existing userIds to determine the next available number
  const existingNumbers = [];
  existingUsers.forEach(user => {
    const match = user.userId.match(/^(\w+?)(\d*)@ringtel$/);
    if (match && match[1] === baseUserId) {
      const num = match[2] ? parseInt(match[2], 10) : 0; // 0 means no number (base case)
      existingNumbers.push(num);
    }
  });
  
  // Find the smallest available number starting from 0
  let nextNumber = 0;
  while (existingNumbers.includes(nextNumber)) {
    nextNumber++;
  }
  
  // Construct the userId
  let userId;
  if (nextNumber === 0) {
    // No number needed for the first occurrence
    userId = `${baseUserId}@ringtel`;
  } else {
    // Append number for subsequent occurrences
    userId = `${baseUserId}${nextNumber}@ringtel`;
  }
  
  return userId;
};

module.exports = generateUniqueEmployeeId;
module.exports = generateUniqueUserId;