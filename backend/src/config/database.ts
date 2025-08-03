import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  // For JSON storage (current implementation)
  json: {
    dataDir: process.env.DATA_DIR || './data',
    usersFile: 'users.json',
    studentsFile: 'students.json',
    teachersFile: 'teachers.json',
    assignmentsFile: 'assignments.json',
    calendarsFile: 'calendars.json',
    strategiesFile: 'strategies.json',
    collegeAdmissionsFile: 'collegeAdmissions.json',
    opportunitiesFile: 'opportunities.json',
    paymentsFile: 'payments.json',
    filesFile: 'files.json',
    notificationsFile: 'notifications.json',
    subscriptionsFile: 'subscriptions.json'
  },
  
  // For MySQL (future implementation)
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'ultra_portal',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql' as const,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // Current storage type
  storageType: process.env.STORAGE_TYPE || 'json' // 'json' or 'mysql'
}; 