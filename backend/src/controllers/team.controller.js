import {
  getProjectTeam,
  updateProjectMemberRole,
  removeProjectMember,
} from "../services/team.service.js";

import { updateMemberRoleSchema } from "../validators/team.validator.js";

// Get all project team members
export const getTeamMembers = async (req, res, next) => {
  try {
    const members = await getProjectTeam({
      db: req.supabase,
      projectId: req.params.projectId,
    });

    return res.status(200).json({
      success: true,
      message: "Project team fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// Update a project member's role
export const updateMemberRole = async (req, res, next) => {
  try {
    const validation = updateMemberRoleSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid member role",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const member = await updateProjectMemberRole({
      db: req.supabase,
      user: req.user,
      projectId: req.params.projectId,
      memberId: req.params.memberId,
      role: validation.data.role,
    });

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// Remove a project member
export const removeTeamMember = async (req, res, next) => {
  try {
    const member = await removeProjectMember({
      db: req.supabase,
      user: req.user,
      projectId: req.params.projectId,
      memberId: req.params.memberId,
    });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};
