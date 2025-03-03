function checkWeekYearEqual(date) {
  // Get the current date
  var firstDate = new Date();

  // Get the previous date
  var secondDate = new Date(date);
  secondDate.setDate(secondDate.getDate() - 1);

  // Compare the month and year
  if (
    secondDate.getMonth() === firstDate.getMonth() &&
    secondDate.getFullYear() === firstDate.getFullYear()
  ) {
    return true;
  } else {
    return;
  }
}

module.exports = checkWeekYearEqual;
