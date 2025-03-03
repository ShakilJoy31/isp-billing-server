function makeToSerialize(items = [], page = 0, limit = 0) {
  return items.map((item, index) => {
    return {
      ...item?.dataValues,
      sl: limit * (page - 1) + (index + 1),
    };
  });
}

module.exports = makeToSerialize;