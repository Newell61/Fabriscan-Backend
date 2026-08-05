import { Inventory } from '../Models/Inventory.js';
import { Bin } from '../Models/bins.js';
import { Collection } from '../Models/Collection.js';

export const getInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll({
      where: { status: 'available' },
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
        {
          model: Collection,
          as: 'collection',
          attributes: ['id', 'siteContactApproved', 'reviewedAt', 'reviewComment'],
        },
      ],
      order: [['availableAt', 'DESC']],
    });

    const responsePayload = inventoryItems.map((item) => ({
      inventory_id: item.id,
      item_barcode: item.id,
      deposit_id: item.collectionId,
      status: item.status,
      arrived_at: item.availableAt,
      bin_barcode: item.bin?.barcode || null,
      collection_id: item.collectionId,
    }));

    res.json(responsePayload);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

export const confirmInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (inventoryItem.status !== 'available') {
      return res.status(409).json({ message: 'Inventory item is not available for confirmation' });
    }

    await inventoryItem.update({ status: 'distributed' });

    res.json({
      inventory_id: inventoryItem.id,
      item_barcode: inventoryItem.id,
      deposit_id: inventoryItem.collectionId,
      status: inventoryItem.status,
      arrived_at: inventoryItem.availableAt,
    });
  } catch (error) {
    console.error('Confirm inventory error:', error);
    res.status(500).json({ message: 'Failed to confirm inventory' });
  }
};
