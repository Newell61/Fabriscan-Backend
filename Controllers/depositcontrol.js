import { Deposit } from '../models/deposit_function.js';
import { Bin } from '../models/bins.js';

const generateBarcode = async (binBarcode) => {
  const depositCount = await Deposit.count({
    include: [
      {
        model: Bin,
        where: { barcode: binBarcode },
        attributes: [],
      },
    ],
  });

  const suffixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const suffix = suffixes[depositCount % suffixes.length];

  return `${binBarcode}-${suffix}`;
};

export const createDeposit = async (req, res) => {
  try {
    const { binBarcode, itemCount, estimatedWeight, clothingType, notes } = req.body;
    const donorId = req.user.id;

    if (!binBarcode) {
      return res.status(400).json({ message: 'Bin barcode is required' });
    }

    const bin = await Bin.findOne({ where: { barcode: binBarcode } });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    if (bin.status !== 'active') {
      return res.status(400).json({ message: 'Bin is not active and cannot accept deposits' });
    }

    const depositBarcode = await generateBarcode(binBarcode);

    const deposit = await Deposit.create({
      donorId,
      binId: bin.id,
      barcode: depositBarcode,
      itemCount,
      estimatedWeight,
      clothingType,
      notes,
    });

    const populatedDeposit = await Deposit.findByPk(deposit.id, {
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
    });

    res.status(201).json(populatedDeposit);
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Failed to create deposit' });
  }
};

export const getDonorDeposits = async (req, res) => {
  try {
    const donorId = req.user.id;

    const deposits = await Deposit.findAll({
      where: { donorId },
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(deposits);
  } catch (error) {
    console.error('Get donor deposits error:', error);
    res.status(500).json({ message: 'Failed to fetch deposits' });
  }
};

export const getDepositByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const deposit = await Deposit.findOne({
      where: { barcode },
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
    });

    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    res.json(deposit);
  } catch (error) {
    console.error('Get deposit by barcode error:', error);
    res.status(500).json({ message: 'Failed to fetch deposit' });
  }
};

export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.findAll({
      include: [
        {
          model: Bin,
          as: 'bin',
          attributes: ['id', 'barcode', 'location'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(deposits);
  } catch (error) {
    console.error('Get all deposits error:', error);
    res.status(500).json({ message: 'Failed to fetch deposits' });
  }
};