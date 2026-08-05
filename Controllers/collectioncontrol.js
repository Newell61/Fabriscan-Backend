import { Bin } from '../Models/bins.js';
import { Collection } from '../Models/Collection.js';
import { Inventory } from '../Models/Inventory.js';

export const createCollection = async (req, res) => {
  try {
    const { binBarcode, itemCount, estimatedWeight, clothingType, notes } = req.body;
    const volunteerId = req.user.id;

    if (!binBarcode) {
      return res.status(400).json({ message: 'Bin barcode is required' });
    }

    const bin = await Bin.findOne({ where: { barcode: binBarcode } });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    if (bin.status !== 'active') {
      return res.status(400).json({ message: 'Bin is not active and cannot be collected' });
    }

    const collection = await Collection.create({
      binId: bin.id,
      volunteerId,
      siteContactApproved: false,
      itemCount,
      estimatedWeight,
      clothingType,
      notes,
    });

    const result = await Collection.findByPk(collection.id, {
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Failed to create collection' });
  }
};

export const getVolunteerCollections = async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const collections = await Collection.findAll({
      where: { volunteerId },
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(collections);
  } catch (error) {
    console.error('Get volunteer collections error:', error);
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
};

export const getPendingCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { siteContactApproved: false },
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(collections);
  } catch (error) {
    console.error('Get pending collections error:', error);
    res.status(500).json({ message: 'Failed to fetch pending collections' });
  }
};

export const approveCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComment } = req.body;
    const siteContactId = req.user.id;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    await collection.update({
      siteContactApproved: true,
      siteContactId,
      reviewedAt: new Date(),
      reviewComment,
    });

    let inventory = await Inventory.findOne({ where: { collectionId: collection.id } });
    if (!inventory) {
      inventory = await Inventory.create({
        collectionId: collection.id,
        binId: collection.binId,
        status: 'available',
        itemCount: collection.itemCount,
        estimatedWeight: collection.estimatedWeight,
        clothingType: collection.clothingType,
        notes: collection.notes,
      });
    }

    const updatedCollection = await Collection.findByPk(collection.id, {
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
    });

    res.json({ collection: updatedCollection, inventory });
  } catch (error) {
    console.error('Approve collection error:', error);
    res.status(500).json({ message: 'Failed to approve collection' });
  }
};

export const disputeCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComment } = req.body;
    const siteContactId = req.user.id;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    await collection.update({
      siteContactApproved: false,
      siteContactId,
      reviewedAt: new Date(),
      reviewComment,
    });

    const updatedCollection = await Collection.findByPk(collection.id, {
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
    });

    res.json(updatedCollection);
  } catch (error) {
    console.error('Dispute collection error:', error);
    res.status(500).json({ message: 'Failed to dispute collection' });
  }
};
