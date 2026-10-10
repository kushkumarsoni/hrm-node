const AppError = require('../exceptions/AppError');
const { jwt } = require('../helpers');
const { User, Department } = require('../models');

class AuthService {
  static async login(email, password) {
    const user = await User.unscoped().findOne({ where: { email: email.toLowerCase() } });

    if (!user || !(await user.comparePassword(password))) throw AppError.unauthorized('Invalid email or password');
    if (user.status !== 'active') throw AppError.forbidden('Your account is inactive. Contact HR.');

    const token = jwt.signToken(user);
    return { token, user: await this.profile(user.id) };
  }

  static async profile(id) {
    return User.findByPk(id, {
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.unscoped().findByPk(userId);

    if (!(await user.comparePassword(currentPassword))) {
      throw AppError.validation({ current_password: ['Current password is incorrect'] });
    }

    user.password = newPassword; // hashed by model hook
    await user.save();
  }
}

module.exports = AuthService;
