import {
  getProjectFiles,
  createProjectFile,
  getProjectFileById,
  updateProjectFile,
  deleteProjectFile,
} from "../services/file.service.js";

import {
  createFileSchema,
  updateFileSchema,
  fileIdSchema,
} from "../validators/file.validator.js";

// GET /api/projects/:projectId/files
export const getFiles = async (req, res, next) => {
  try {
    const files = await getProjectFiles(req.supabase, req.params.projectId);

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:projectId/files
export const createFile = async (req, res, next) => {
  try {
    const validation = createFileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid file data",
        errors: validation.error.flatten(),
      });
    }

    const file = await createProjectFile(
      req.supabase,
      req.user.id,
      req.params.projectId,
      validation.data,
    );

    res.status(201).json({
      success: true,
      message: "File or folder created successfully",
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:projectId/files/:fileId
export const getFile = async (req, res, next) => {
  try {
    const validation = fileIdSchema.safeParse(req.params.fileId);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const file = await getProjectFileById(
      req.supabase,
      req.params.projectId,
      validation.data,
    );

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/projects/:projectId/files/:fileId
export const updateFile = async (req, res, next) => {
  try {
    const idValidation = fileIdSchema.safeParse(req.params.fileId);
    const bodyValidation = updateFileSchema.safeParse(req.body);

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: bodyValidation.error.flatten(),
      });
    }

    const file = await updateProjectFile(
      req.supabase,
      req.user.id,
      req.params.projectId,
      idValidation.data,
      bodyValidation.data,
    );

    res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:projectId/files/:fileId
export const deleteFile = async (req, res, next) => {
  try {
    const validation = fileIdSchema.safeParse(req.params.fileId);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    await deleteProjectFile(
      req.supabase,
      req.params.projectId,
      validation.data,
    );

    res.status(200).json({
      success: true,
      message: "File or folder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
