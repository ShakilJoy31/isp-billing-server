function removeEmptyKey(obj) {
  for (var key in obj) {
    if (!obj[key]) {
      delete obj[key];
    }
  }
  return obj;
}

module.exports = removeEmptyKey;
