import { DataTypes, Sequelize } from 'sequelize';
import { Vehicle } from '../models/Vehicle.js';
import { View } from '../models/View.js';
import { getDbPath, isDev } from './pathResolver.js';
import { Brand } from '../models/Brand.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: getDbPath(),
  logging: isDev(),
  logQueryParameters: true,
});

Vehicle.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    model: {
      type: DataTypes.STRING,
    },
    equipment: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
    license: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'vehicle',
    freezeTableName: true,
  }
);

View.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'view',
    freezeTableName: true,
  }
);

Brand.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'brand',
    freezeTableName: true,
  }
);

Vehicle.hasMany(View, {
  sourceKey: 'id',
  foreignKey: 'vehicleId',
  as: 'views',
});
View.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

Brand.hasMany(Vehicle, {
  sourceKey: 'id',
  foreignKey: 'brandId',
  as: 'brand',
});
Vehicle.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Base de données initialisée avec succès.');
  } catch (error) {
    console.error(
      'Erreur lors de l’initialisation de la base de données :',
      error
    );
    throw error;
  }
};

export const closeDb = async () => {
  try {
    await sequelize.close();
    console.log('Connexion à la base de données fermée proprement.');
  } catch (error) {
    console.error('Erreur lors de la fermeture de la base de données :', error);
  }
};
