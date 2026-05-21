import { apiClient } from './client';
import type {
  UserDto,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@freestyle/shared';

interface AuthOk { success: true; user: UserDto }
interface OkOnly { success: true; message?: string }

export const authApi = {
  async register(payload: RegisterRequest): Promise<UserDto> {
    const { data } = await apiClient.post<AuthOk>('/auth/register', payload);
    return data.user;
  },

  async login(payload: LoginRequest): Promise<UserDto> {
    const { data } = await apiClient.post<AuthOk>('/auth/login', payload);
    return data.user;
  },

  async refresh(): Promise<UserDto | null> {
    try {
      const { data } = await apiClient.post<AuthOk>('/auth/refresh');
      return data.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async me(): Promise<UserDto | null> {
    try {
      const { data } = await apiClient.get<AuthOk>('/auth/me');
      return data.user;
    } catch {
      return null;
    }
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post<OkOnly>('/auth/forgot-password', payload);
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post<OkOnly>('/auth/reset-password', payload);
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<void> {
    await apiClient.post<OkOnly>('/auth/verify-email', payload);
  },
};
