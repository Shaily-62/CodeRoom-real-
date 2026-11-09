import { getCurrentUser } from "./authService";
import { useAuthStore } from "../../store/authStore";

export const initializeAuth = async () => {
  const {
    accessToken,
    logout,
    setProfile,
  } = useAuthStore.getState();

  // No saved token means user is not logged in.
  if (!accessToken) {
    return;
  }

  try {
    const response = await getCurrentUser();

    const result = response.data;

    setProfile(result.profile);

  } catch (error) {
    console.error("Session verification failed:", error);

    // Clear invalid or expired authentication state.
    logout();
  }
};