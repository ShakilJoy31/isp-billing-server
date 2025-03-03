function checkLastYear(date) {
  // Get the current date
  var currentDate = new Date();

  // Get the previous year's date
  var lastYearDate = new Date(date);

  // Compare the year
  return lastYearDate.getFullYear() === currentDate.getFullYear();
}

module.exports = checkLastYear;
