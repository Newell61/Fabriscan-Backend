import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Inventory } from './Inventory.js';
import { Organisation } from './Organisation.js';

export const Distribution = sequelize.define(
  'Distribution',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Organisations',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    inventoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Inventories',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    orgRepEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'signed_off'),
      defaultValue: 'pending',
      allowNull: false,
    },
    signedOffAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignedAt: {
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

Distribution.belongsTo(Organisation, {
  foreignKey: 'orgId',
  as: 'organisation',
});

Distribution.belongsTo(Inventory, {
  foreignKey: 'inventoryId',
  as: 'inventory',
});
