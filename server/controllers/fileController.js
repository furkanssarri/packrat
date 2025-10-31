import supabase from "../config/supabaseClient.js";
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

export const editFile = async (req, res) => {
  const { renameInput } = req.body;
  const sanitizedName = renameInput.trim();
  const { id } = req.params;
  try {
    const fileToEdit = await prisma.file.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!fileToEdit) return res.status(404).send("File not found.");

    await prisma.file.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name: sanitizedName,
      },
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error editing file: ", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  console.log("deletefile callde with id: ", id);

  if (!id) {
    console.error("No id provided in req.params.");
    return res.status(400).send("Missing file id");
  }

  try {
    const fileRecord = await prisma.file.findUnique({
      where: { id: id },
    });

    if (!fileRecord) return res.status(404).send("File not found.");

    const { error: storageError } = await supabase.storage
      .from("files")
      .remove([fileRecord.path]);

    if (storageError) throw storageError;

    await prisma.file.delete({ where: { id: id } });

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error deleting file: ", err);
    return res.status(500).send("Database error.");
  }
};
