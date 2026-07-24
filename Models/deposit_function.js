import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Bin } from './bins.js';

export const Deposit = sequelize.define(
  'Deposit',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    donorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    binId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Bin,
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    itemCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of items deposited',
    },
    estimatedWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Estimated weight in kg',
    },
    clothingType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g., shirt, jeans, dress',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

User.hasMany(Deposit, { foreignKey: 'donorId', as: 'deposits' });
Deposit.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

Bin.hasMany(Deposit, { foreignKey: 'binId', as: 'deposits' });
Deposit.belongsTo(Bin, { foreignKey: 'binId', as: 'bin' });