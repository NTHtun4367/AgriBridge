import { authService } from "./services/auth";

/**
 * Other modules should only use this AuthModule object
 * to interact with authentication or users.
 */
export const AuthModule = {
  service: authService,
};
