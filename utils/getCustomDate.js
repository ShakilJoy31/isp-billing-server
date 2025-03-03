function getCustomDate(providedDate, showTime) {
  const date = new Date(providedDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[date.getMonth()];
  const today = `${date.getDate()} ${monthName} ${date.getFullYear()}`;

  return `${today} ${
    showTime
      ? ", " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""
  }`;
  // var time = hour + ":" + min + ":" + sec;
  // myDiv.innerText = `Today is  ${today}. Time is ${time}`;
}

module.exports = getCustomDate;
