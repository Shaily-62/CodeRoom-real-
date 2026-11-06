import { supabase } from "../config/supabase.js";
import { createUserSupabaseClient } from "../config/supabaseUser.js";


//signup user
export const signupUser = async ({ full_name, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        full_name: full_name.trim(),
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Unable to create user account");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },

    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
        }
      : null,

    requiresEmailConfirmation: !data.session,
  };
};

//login user
export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user || !data.session) {
    throw new Error("Unable to complete login");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },

    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      token_type: data.session.token_type,
    },
  };
};

//logout
export const logoutUser = async () => {
  return {
    message: "Logout successful",
  };
};

//me
export const getCurrentUserProfile = async (userSupabase, userId) => {
  const { data, error } = await userSupabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};