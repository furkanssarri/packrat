import prisma from "../db/prisma.js";

export const getFolderData = async ({ userId, orderBy, folderId = null }) => {
  if (folderId) {
    // Fetch specific folder and its contents
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        children: true,
        files: true,
        parent: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!folder || folder.userId !== userId) return null;

    return {
      title: folder.name,
      folders: folder.children,
      files: folder.files,
      parentFolder: folder.parent,
      currentFolder: folder,
    };
  } else {
    // Fetch the root level
    const [folders, files] = await Promise.all([
      prisma.folder.findMany({
        where: { userId, parentId: null },
        orderBy,
      }),
      prisma.file.findMany({
        where: { userId, folderId: null },
        orderBy,
      }),
    ]);

    return {
      title: "My Drive || Packrat",
      folders,
      files,
      parentFolder: null,
    };
  }
};
