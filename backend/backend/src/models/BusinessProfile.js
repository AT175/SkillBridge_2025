import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import User from './User.js';

export class BusinessProfile extends Model {}

BusinessProfile.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  background: { type: DataTypes.TEXT },
  contactInfo: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING },
  documentsUrl: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'BusinessProfile',
});

BusinessProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(BusinessProfile, { foreignKey: 'userId' });

export default BusinessProfile;
