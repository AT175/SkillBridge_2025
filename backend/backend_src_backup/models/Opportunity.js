import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import BusinessProfile from './BusinessProfile.js';

export class Opportunity extends Model {}

Opportunity.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  roleTitle: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING },
  requiredSkills: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  workLocation: { type: DataTypes.STRING },
  numVolunteers: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
  sequelize,
  modelName: 'Opportunity',
});

Opportunity.belongsTo(BusinessProfile, { foreignKey: 'businessId' });
BusinessProfile.hasMany(Opportunity, { foreignKey: 'businessId' });

export default Opportunity;
