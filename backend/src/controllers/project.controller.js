import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../services/project.service.js";

//create a project
export const createProjectController = async (req, res, next) => {
  try {
    // 1. Validate project details
    const validation = createProjectSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 2. Create project for authenticated user
    const project = await createProject(
      req.supabase,
      req.user.id,
      validation.data,
    );

    // 3. Return created project
    return res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

//all projects
export const getAllProjectsController = async (req, res, next) => {
  try {
    const projects = await getAllProjects(req.supabase);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully!",
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

//get a project by id
export const getProjectByIdController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectById(req.supabase, projectId);

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully!",
      data: project,
    });
  } catch (error) {
    // Project not found or not accessible
    if (error.code === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    next(error);
  }
};

//update a project
export const updateProjectController = async (req, res, next) => {
  try {
    const validation = updateProjectSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { projectId } = req.params;

    const project = await updateProject(
      req.supabase,
      projectId,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: project,
    });
  } catch (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    next(error);
  }
};

//delete a project
export const deleteProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await deleteProject(
      req.supabase,
      projectId
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully!",
      data: project,
    });
  } catch (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    next(error);
  }
};