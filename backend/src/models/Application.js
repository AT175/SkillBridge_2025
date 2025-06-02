import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import VolunteerProfile from './VolunteerProfile.js';
import Opportunity from './Opportunity.js';

export class Application extends Model {}

Application.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  volunteerId: { type: DataTypes.UUID, allowNull: false },
  opportunityId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('applied', 'reviewed', 'accepted', 'rejected'), defaultValue: 'applied' },
  message: { type: DataTypes.TEXT },
  hoursVolunteered: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Application',
});

Application.belongsTo(VolunteerProfile, { foreignKey: 'volunteerId' });
Application.belongsTo(Opportunity, { foreignKey: 'opportunityId' });
VolunteerProfile.hasMany(Application, { foreignKey: 'volunteerId' });
Opportunity.hasMany(Application, { foreignKey: 'opportunityId' });

export default Application;
