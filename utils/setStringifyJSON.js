// for set json data as a string in mysql table field
function setStringifyJSON(key = "") {
  return function (value) {
    if (typeof value === 'string') {
      this.setDataValue(key, value);
    } else {
      this.setDataValue(key, JSON.stringify(value));
    }
  };
}

module.exports = setStringifyJSON;
