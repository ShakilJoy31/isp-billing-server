function slug_generator(name) {
  if (!name) return "";
  let slug = name.toLowerCase().replace(/\s/g, "-");
  return slug?.replaceAll("%", "-percentage-")?.replaceAll("?", "")
}

module.exports = slug_generator;