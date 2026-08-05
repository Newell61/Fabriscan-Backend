import { Bin } from '../Models/bins.js';
import { User } from '../Models/User.js';

export const getBins = async (req, res) => {
  try {
    const bins = await Bin.findAll({
      include: [
        {
          model: User,
          as: 'siteContact',
          attributes: ['id', 'name', 'email'],
        },
      ],
      attributes: ['id', 'barcode', 'location', 'status', 'capacity', 'currentWeight', 'description', 'siteContactId'],
    });
    res.json(bins);
  } catch (error) {
    console.error('Get bins error:', error);
    res.status(500).json({ message: 'Failed to fetch bins' });
  }
};

export const getBinByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const bin = await Bin.findOne({
      where: { barcode },
      attributes: ['id', 'barcode', 'location', 'status', 'capacity', 'currentWeight', 'description'],
    });

    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    res.json(bin);
  } catch (error) {
    console.error('Get bin by barcode error:', error);
    res.status(500).json({ message: 'Failed to fetch bin' });
  }
};

export const createBin = async (req, res) => {
  try {
    const { barcode, location, capacity, description } = req.body;

    if (!barcode || !location) {
      return res.status(400).json({ message: 'Barcode and location are required' });
    }

    const existingBin = await Bin.findOne({ where: { barcode } });
    if (existingBin) {
      return res.status(409).json({ message: 'Barcode already exists' });
    }

    const bin = await Bin.create({
      barcode,
      location,
      capacity,
      description,
      status: 'active',
    });

    res.status(201).json(bin);
  } catch (error) {
    console.error('Create bin error:', error);
    res.status(500).json({ message: 'Failed to create bin' });
  }
};

export const updateBin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, capacity, location, description } = req.body;

    const bin = await Bin.findByPk(id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    await bin.update({
      ...(status && { status }),
      ...(capacity && { capacity }),
      ...(location && { location }),
      ...(description !== undefined && { description }),
    });

    res.json(bin);
  } catch (error) {
    console.error('Update bin error:', error);
    res.status(500).json({ message: 'Failed to update bin' });
  }
};

export const assignContactToBin = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteContactId } = req.body;

    if (!siteContactId) {
      return res.status(400).json({ message: 'siteContactId is required' });
    }

    const bin = await Bin.findByPk(id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    const user = await User.findByPk(siteContactId);
    if (!user || user.role !== 'site_contact') {
      return res.status(400).json({ message: 'Site contact user not found or invalid role' });
    }

    await bin.update({ siteContactId });

    res.json(bin);
  } catch (error) {
    console.error('Assign contact error:', error);
    res.status(500).json({ message: 'Failed to assign site contact' });
  }
};