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
    const existingUser = await ClientInformation.findOne({ where: { userId } });
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

module.exports = generateUniqueEmployeeId;
module.exports = generateUniqueUserId;