import prisma from "../db/prisma.js";
import supabase from "../config/supabaseClient.js";
import sanitizeFileName from "../validators/updateSanitizer.js";

export const uploadSingleFile = async (req, res) => {
  const { file } = req;
  const { sort, parentId } = req.body;
  const userId = req.user.id;

  if (!file) return res.status(400).send("No file uploaded.");

  // Generate a unique storage name and path
  const sanitizedName = sanitizeFileName(file.originalname);
  const storageName = `${Date.now()}_${sanitizedName}`;
  const filePath = `${userId}/${storageName}`;

  try {
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("files") // bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Retrieve public URL
    const { data, error: urlError } = await supabase.storage
      .from("files")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    const publicUrl = data.publicUrl;
    console.log(publicUrl);

    // Save metadata to Prisma
    await prisma.file.create({
      data: {
        name: file.originalname,
        storageName: storageName,
        type: file.mimetype,
        size: file.size,
        path: filePath,
        url: publicUrl,
        user: { connect: { id: userId } },
        ...(parentId ? { folder: { connect: { id: parentId } } } : {}),
      },
    });

    const targetFolder = parentId
      ? `/folders/${encodeURIComponent(parentId)}`
      : "/dashboard";
    const sortQuery = sort ? `?sort=${encodeURIComponent(sort)}` : "";

    return res.redirect(`${targetFolder}${sortQuery}`);
  } catch (err) {
    console.error("Error uploading the file:", err);
    res.status(500).send("Error uploading the file.");
  }
};
