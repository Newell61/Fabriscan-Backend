import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Bin } from './bins.js';

export const Collection = sequelize.define(
  'Collection',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    siteContactId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    siteContactApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reviewComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    collectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
  },
  {
    timestamps: true,
    underscored: true,
  }
);

Bin.hasMany(Collection, { foreignKey: 'binId', as: 'collections' });
Collection.belongsTo(Bin, { foreignKey: 'binId', as: 'bin' });
