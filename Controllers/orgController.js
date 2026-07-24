import { Organisation } from '../models/Organisation.js';

export const createOrganisation = async (req, res) => {
  try {
    const { name, contactName, contactEmail, address, phone, notes } = req.body;

    if (!name || !contactName || !contactEmail) {
      return res.status(400).json({ message: 'Organisation name, contact name, and contact email are required' });
    }

    const organisation = await Organisation.create({
      name,
      contactName,
      contactEmail,
      address,
      phone,
      notes,
      status: 'pending',
    });

    res.status(201).json(organisation);
  } catch (error) {
    console.error('Create organisation error:', error);
    res.status(500).json({ message: 'Failed to create organisation' });
  }
};

export const getOrganisations = async (req, res) => {
  try {
    const where = {};

    if (req.user.role === 'sorting_team_head') {
      where.status = 'approved';
    } else if (req.user.role === 'org_rep') {
      where.contactEmail = req.user.email;
    }

    const organisations = await Organisation.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(organisations);
  } catch (error) {
    console.error('Get organisations error:', error);
    res.status(500).json({ message: 'Failed to fetch organisations' });
  }
};

export const approveOrganisation = async (req, res) => {
  try {
    const { id } = req.params;

    const organisation = await Organisation.findByPk(id);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    await organisation.update({
      status: 'approved',
      approvedAt: new Date(),
    });

    res.json(organisation);
  } catch (error) {
    console.error('Approve organisation error:', error);
    res.status(500).json({ message: 'Failed to approve organisation' });
  }
};

export const rejectOrganisation = async (req, res) => {
  try {
    const { id } = req.params;

    const organisation = await Organisation.findByPk(id);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    await organisation.update({ status: 'rejected' });

    res.json(organisation);
  } catch (error) {
    console.error('Reject organisation error:', error);
    res.status(500).json({ message: 'Failed to reject organisation' });
  }
};

export const suspendOrganisation = async (req, res) => {
  try {
    const { id } = req.params;

    const organisation = await Organisation.findByPk(id);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    await organisation.update({ status: 'suspended' });

    res.json(organisation);
  } catch (error) {
    console.error('Suspend organisation error:', error);
    res.status(500).json({ message: 'Failed to suspend organisation' });
  }
};