function calculateReadingTime(words) {
  // Assuming average reading speed of 200 words per minute
  var wordsPerMinute = 200;

  // Calculate the reading time in minutes
  var minutes = words / wordsPerMinute;

  // Round up to the nearest whole number
  var roundedMinutes = Math.ceil(minutes);

  return roundedMinutes;
}
