import { User } from './User';
import { BusinessEntity } from './BusinessEntity';
import { Role } from './Role';
import { Permission } from './Permission';
import { RolePermission } from './RolePermission';
import { ActivityLog } from './ActivityLog';

// ===================
// User ↔ BusinessEntity
// ===================
User.hasMany(BusinessEntity, {
  foreignKey: 'ownerId',
  as: 'businessEntities',
});

BusinessEntity.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// ===================
// User ↔ ActivityLog
// ===================
User.hasMany(ActivityLog, {
  foreignKey: 'userId',
});

ActivityLog.belongsTo(User, {
  foreignKey: 'userId',
});

// ===================
// Exports
// ===================
export {
  User,
  Role,
  Permission,
  RolePermission,
  BusinessEntity,
  ActivityLog,
};
