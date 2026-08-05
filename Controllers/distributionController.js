import { Organisation } from '../Models/Organisation.js';
import { Inventory } from '../Models/Inventory.js';
import { Distribution } from '../Models/Distribution.js';

export const createDistributions = async (req, res) => {
  try {
    const { orgId, inventoryIds, notes } = req.body;

    if (!orgId || !Array.isArray(inventoryIds) || inventoryIds.length === 0) {
      return res.status(400).json({ message: 'Organisation and inventory selection are required' });
    }

    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    if (organisation.status !== 'approved') {
      return res.status(403).json({ message: 'Organisation must be approved before distribution' });
    }

    const uniqueInventoryIds = [...new Set(inventoryIds)];
    const inventoryItems = await Inventory.findAll({
      where: {
        id: uniqueInventoryIds,
      },
    });

    if (inventoryItems.length !== uniqueInventoryIds.length) {
      return res.status(404).json({ message: 'One or more inventory items were not found' });
    }

    const unavailableItem = inventoryItems.find((item) => item.status !== 'available');
    if (unavailableItem) {
      return res.status(409).json({ message: `Inventory item ${unavailableItem.id} is not available` });
    }

    const distributions = [];
    for (const inventoryItem of inventoryItems) {
      await inventoryItem.update({ status: 'distributed' });
      const distribution = await Distribution.create({
        orgId,
        inventoryId: inventoryItem.id,
        orgRepEmail: organisation.contactEmail,
        notes,
      });
      distributions.push(distribution);
    }

    res.status(201).json({ distributions });
  } catch (error) {
    console.error('Create distributions error:', error);
    res.status(500).json({ message: 'Failed to create distributions' });
  }
};

export const getMyDistributions = async (req, res) => {
  try {
    const distributions = await Distribution.findAll({
      where: {
        orgRepEmail: req.user.email,
      },
      include: [
        {
          model: Inventory,
          as: 'inventory',
          attributes: ['id', 'status', 'availableAt', 'binId'],
        },
      ],
      order: [['assignedAt', 'DESC']],
    });

    res.json(distributions);
  } catch (error) {
    console.error('Get my distributions error:', error);
    res.status(500).json({ message: 'Failed to fetch assigned distributions' });
  }
};

export const signOffDistribution = async (req, res) => {
  try {
    const { id } = req.params;

    const distribution = await Distribution.findByPk(id);
    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }

    if (distribution.orgRepEmail !== req.user.email) {
      return res.status(403).json({ message: 'You are not authorized to sign off this distribution' });
    }

    if (distribution.status === 'signed_off') {
      return res.status(409).json({ message: 'Distribution has already been signed off' });
    }

    await distribution.update({
      status: 'signed_off',
      signedOffAt: new Date(),
    });

    res.json(distribution);
  } catch (error) {
    console.error('Sign off distribution error:', error);
    res.status(500).json({ message: 'Failed to sign off distribution' });
  }
};
