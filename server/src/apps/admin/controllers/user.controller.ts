import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { AuthService } from '../../auth/services/auth.service.js';
import type { ApiResponse } from '../../../types/index.js';

export class UserController {
  static async list(req: Request, res: Response): Promise<void> {
    const query = req.validatedQuery;
    const result = await UserService.findPaginated(query);

    const response: ApiResponse = {
      success: true,
      message: 'Users retrieved successfully',
      data: {
        data: result.data.map((u) => UserService.sanitize(u)),
        pagination: result.pagination,
      },
    };
    res.json(response);
  }

  static async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await UserService.findById(id);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: `User with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: UserService.sanitize(user),
    };
    res.json(response);
  }

  static async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const input = req.validatedBody;

    if (req.user && req.user.id === id) {
      const response: ApiResponse = {
        success: false,
        message: 'You cannot modify your own account through this endpoint.',
      };
      res.status(403).json(response);
      return;
    }

    const user = await UserService.update(id, input);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: `User with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User updated successfully',
      data: UserService.sanitize(user),
    };
    res.json(response);
  }

  static async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      const response: ApiResponse = {
        success: false,
        message: 'You cannot delete your own account.',
      };
      res.status(403).json(response);
      return;
    }

    const deleted = await UserService.softDelete(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        message: `User with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully. All active sessions revoked.',
    };
    res.json(response);
  }

  static async resetPassword(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const { newPassword } = req.validatedBody;

    const reset = await UserService.resetPassword(id, newPassword);

    if (!reset) {
      const response: ApiResponse = {
        success: false,
        message: `User with id "${id}" not found`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Password reset successfully. All sessions revoked.',
    };
    res.json(response);
  }

  static async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.validatedBody;
    const changed = await UserService.changeOwnPassword(req.user!.id, currentPassword, newPassword);

    if (!changed) {
      const response: ApiResponse = {
        success: false,
        message: 'Current password is incorrect',
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully. All sessions revoked.',
    };
    res.json(response);
  }
}
