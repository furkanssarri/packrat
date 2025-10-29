import prisma from "../db/prisma.js";

export const getAllFolders = async (req, res) => {
  const userId = req.user?.id;
  const folders = await prisma.folder.findMany({
    where: { userId, parentId: null },
    orderBy: { createdAt: "asc" },
  });
  res.render("pages/folders/index", {
    title: "My drive || Packrat",
    folders,
  });
};
export const getFolderContents = async (req, res) => {
  const { id } = req.params;

  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { children: true, files: true },
  });

  if (!folder) {
    return res.status(404).render("pages/404", {
      title: "Folder not found || Packrat",
      message: "The folder you’re looking for doesn’t exist.",
    });
  }

  res.render("pages/folders/show", {
    title: `${folder.name} || Packrat`,
    folder,
  });
};

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user?.id;
  await prisma.folder.create({
    data: {
      name,
      userId,
      parentId: parentId || null,
      path: parentId
        ? (await prisma.folder.findUnique({ where: { id: parentId } })).path +
          "/" +
          name
        : "/" + name,
    },
  });
  res.redirect(parentId ? `/folders/${parentId}` : "/folders");
};

export const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await prisma.folder.update({
    where: { id },
    data: { name },
  });
  res.redirect(`/folders/${id}`);
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  const deleteRecursively = async (folderId) => {
    const children = await prisma.folder.findMany({
      where: { parentId: folderId },
    });

    for (const child of children) await deleteRecursively(child.id);

    await prisma.file.deleteMany({ where: { folderId } });
    await prisma.folder.delete({ where: { id: folderId } });
  };
  await deleteRecursively(id);
  res.redirect("/folders");
};
