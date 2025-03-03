function convertToNestedCategories(data) {
  if (!data || data?.length < 1) return [];

  const nestedArray = [];

  function findChildren(parentId) {
    const children = data.filter((item) => item?.parentId == parentId);

    if (children.length === 0) return [];
    return children.map((child) => ({
      ...child,
      children: findChildren(child.id),
    }));
  }

  nestedArray.push(...findChildren());
  return nestedArray;
}

module.exports = convertToNestedCategories