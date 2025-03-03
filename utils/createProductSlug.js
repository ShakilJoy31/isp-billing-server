function createProductSlug(name) {
  let slug = name.toLowerCase().replace(/\s/g, "-");
  return slug?.replaceAll('%', '-')
}



module.exports = createProductSlug;