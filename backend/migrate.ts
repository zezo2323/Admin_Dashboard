import sequelize from './config/database';
import { User } from './models/User';
import { Role } from './models/Role';
import { Permission } from './models/Permission';
import { RolePermission } from './models/RolePermission';
import { BusinessEntity } from './models/BusinessEntity';
import { ActivityLog } from './models/ActivityLog';

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    
    // Sync all models
    await sequelize.sync({ force: false }); // Use force: true to drop and recreate tables
    
    console.log('Database migration completed successfully');
    
    // Create default roles if they don't exist
    const roles = ['admin', 'manager', 'user'];
    for (const roleName of roles) {
      await Role.findOrCreate({
        where: { name: roleName },
        defaults: {
          name: roleName,
          description: `Default ${roleName} role`
        }
      });
    }
    
    console.log('Default roles created/verified');
    
    // Create default permissions if they don't exist
    const permissions = [
      { name: 'manage_users', description: 'Manage user accounts' },
      { name: 'manage_business', description: 'Manage business entities' },
      { name: 'view_reports', description: 'View reports and analytics' },
      { name: 'manage_settings', description: 'Manage system settings' }
    ];
    
    for (const perm of permissions) {
      await Permission.findOrCreate({
        where: { name: perm.name },
        defaults: perm
      });
    }
    
    console.log('Default permissions created/verified');
    
    // Create a default admin user if none exists
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!', // This will be hashed by the model hook
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();