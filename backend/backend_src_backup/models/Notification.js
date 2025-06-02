import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import User from './User.js';

export class Notification extends Model {}

Notification.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  link: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Notification',
  timestamps: true
});

Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

export default Notification;
