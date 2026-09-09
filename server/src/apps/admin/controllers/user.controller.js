import { UserService } from '../services/user.service.js';

export class UserController {
  static async list(req, res) {
    const query = req.validatedQuery;
    const result = await UserService.findPaginated(query);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        data: result.data.map((u) => UserService.sanitize(u)),
        pagination: result.pagination,
      },
    });
  }

  static async getById(req, res) {
    const { id } = req.params;
    const user = await UserService.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: `User with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: UserService.sanitize(user),
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    const input = req.validatedBody;

    if (req.user && req.user.id === id) {
      res.status(403).json({
        success: false,
        message: 'You cannot modify your own account through this endpoint.',
      });
      return;
    }

    const user = await UserService.update(id, input);

    if (!user) {
      res.status(404).json({
        success: false,
        message: `User with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: UserService.sanitize(user),
    });
  }

  static async delete(req, res) {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      res.status(403).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
      return;
    }

    const deleted = await UserService.softDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: `User with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully. All active sessions revoked.',
    });
  }

  static async resetPassword(req, res) {
    const { id } = req.params;
    const { newPassword } = req.validatedBody;

    const reset = await UserService.resetPassword(id, newPassword);

    if (!reset) {
      res.status(404).json({
        success: false,
        message: `User with id "${id}" not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password reset successfully. All sessions revoked.',
    });
  }

  static async changePassword(req, res) {
    const { currentPassword, newPassword } = req.validatedBody;
    const changed = await UserService.changeOwnPassword(req.user.id, currentPassword, newPassword);

    if (!changed) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password changed successfully. All sessions revoked.',
    });
  }
}