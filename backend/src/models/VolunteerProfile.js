import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import User from './User.js';

export class VolunteerProfile extends Model {}

VolunteerProfile.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  skills: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  interests: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  education: { type: DataTypes.TEXT },
  experience: { type: DataTypes.TEXT },
  cvUrl: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'VolunteerProfile',
});

VolunteerProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(VolunteerProfile, { foreignKey: 'userId' });

export default VolunteerProfile;
