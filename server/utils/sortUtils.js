/**
 * Returns a Prisma-compatible orderBy object based on a sort key.
 * @param {string} sort - Sort option from req.query.sort
 * @returns {{orderBy: object, sortLabel: string}} - Prisma orderBy and label
 */
export function getSortParams(sort) {
  let orderBy = { createdAt: "desc" };
  let sortLabel;

  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      sortLabel = "Oldest first";
      break;
    case "size-desc":
      orderBy = { size: "desc" };
      sortLabel = "Largest first";
      break;
    case "size-asc":
      orderBy = { size: "asc" };
      sortLabel = "Smallest first";
      break;
    case "type":
      orderBy = { type: "asc" };
      sortLabel = "File type";
      break;
    case "name":
      orderBy = { name: "asc" };
      sortLabel = "Name (A–Z)";
      break;
    default:
      orderBy = { createdAt: "desc" };
      sortLabel = "Newest first";
  }

  return { orderBy, sortLabel };
}
