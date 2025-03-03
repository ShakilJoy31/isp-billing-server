function checkWeekEqual(date) {
  // Get the current date
  var currentDate = new Date();

  // Get the previous date
  var inputDate = new Date(date);

  // Check if both dates are in the same week
  if (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    Math.floor(currentDate.getDate() / 7) === Math.floor(inputDate.getDate() / 7)
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkWeekEqual;
