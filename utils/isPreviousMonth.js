function isPreviousMonth(date) {
  const providedDate = new Date(date)
  const currentDate = new Date();
  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    currentDate.getDate()
  );

  return (
    providedDate.getFullYear() === previousMonthDate.getFullYear() &&
    providedDate.getMonth() === previousMonthDate.getMonth()
  );
}

module.exports = isPreviousMonth;

