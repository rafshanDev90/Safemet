import { User } from '../../../models/user.model.js';
import { AuthService } from '../../auth/services/auth.service.js';

function buildFilter(query) {
  const filter = { isDeleted: false };
  if (query.role) filter.role = query.role;
  if (query.search) {
    const term = query.search;
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
    ];
  }
  return filter;
}

export class UserService {
  static async findPaginated(query) {
    const { page, limit } = query;
    const filter = buildFilter(query);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static async findById(id) {
    return User.findOne({ _id: id, isDeleted: false });
  }

  static async update(id, updates) {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) return null;

    if (updates.name !== undefined) user.name = updates.name;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.mfaEnabled !== undefined) user.mfaEnabled = updates.mfaEnabled;

    await user.save();
    return user;
  }

  static async softDelete(id) {
    const user = await User.findById(id);
    if (!user) return false;

    user.isDeleted = true;
    await user.save();

    await AuthService.revokeAllUserTokens(id);
    return true;
  }

  static async resetPassword(id, newPassword) {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) return false;

    const passwordHash = await AuthService.hashPassword(newPassword);
    user.passwordHash = passwordHash;
    await user.save();

    await AuthService.revokeAllUserTokens(id);
    return true;
  }

  static async changeOwnPassword(userId, currentPassword, newPassword) {
    const user = await User.findOne({ _id: userId, isDeleted: false }).select('+passwordHash');
    if (!user) return false;

    const valid = await AuthService.verifyPassword(currentPassword, user.passwordHash);
    if (!valid) return false;

    const passwordHash = await AuthService.hashPassword(newPassword);
    user.passwordHash = passwordHash;
    await user.save();

    await AuthService.revokeAllUserTokens(userId);
    return true;
  }

  static sanitize(user) {
    return AuthService.sanitizeUser(user);
  }
}