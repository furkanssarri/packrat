import prisma from "../db/prisma.js";

export const moveFile = async (req, res) => {
  const { fileId, targetFolderId } = req.body;
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId)
      return res.status(403).send("Unauthorized to perform this action.");

    await prisma.file.update({
      where: { id: fileId },
      data: {
        folderId: targetFolderId ? targetFolderId : null,
      },
    });

    res.redirect(targetFolderId ? `/folders/${targetFolderId}` : "/dashboard");
  } catch (err) {
    console.error("Error in 'Move File' controller: ", err);
    return res.status(500).send("Failed to move the file");
  }
};
