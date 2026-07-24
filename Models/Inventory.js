import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Bin } from './bins.js';
import { Collection } from './Collection.js';

export const Inventory = sequelize.define(
  'Inventory',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Collections',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    binId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bins',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM('available', 'reserved', 'archived', 'distributed'),
      defaultValue: 'available',
      allowNull: false,
    },
    itemCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estimatedWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    clothingType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availableAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

Bin.hasMany(Inventory, { foreignKey: 'binId', as: 'inventory' });
Inventory.belongsTo(Bin, { foreignKey: 'binId', as: 'bin' });

Collection.hasOne(Inventory, { foreignKey: 'collectionId', as: 'inventory' });
Inventory.belongsTo(Collection, { foreignKey: 'collectionId', as: 'collection' });
