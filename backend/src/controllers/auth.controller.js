import { signupSchema,loginSchema } from "../validators/auth.validator.js";
import { signupUser, loginUser,logoutUser,getCurrentUserProfile } from "../services/auth.service.js";


//signup controller
export const signup = async (req, res, next) => {
  try {
    // 1. Validate incoming request data
    const validation = signupSchema.safeParse(req.body);

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

    // 2. Create user account
    const result = await signupUser(validation.data);

    // 3. Send successful response
    return res.status(201).json({
      success: true,
      message: result.requiresEmailConfirmation
        ? "Account created. Please check your email for confirmation."
        : "Account created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//login controller
export const login = async (req, res, next) => {
  try {
    // 1. Validate login data
    const validation = loginSchema.safeParse(req.body);

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

    // 2. Authenticate user
    const result = await loginUser(validation.data);

    // 3. Return successful response
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: result,
    });
  } catch (error) {
    // Avoid revealing whether an email or password was incorrect
    if (error.status === 400 || error.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    next(error);
  }
};

//logout
export const logout = async (req, res, next) => {
  try {
    await logoutUser();

    return res.status(200).json({
      success: true,
      message: "Logout successful!",
    });
  } catch (error) {
    next(error);
  }
};

//me
export const getMe = async (req, res, next) => {
  try {
    const profile = await getCurrentUserProfile(
      req.supabase,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};