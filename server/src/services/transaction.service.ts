import Transaction from '@models/Transaction.js';
import Property from '@models/Property.js';
import Tenant from '@models/Tenant.js';
import Unit from '@models/Unit.js';
import { Op } from 'sequelize';

export const getAllTransactions = async (query: any = {}) => {
  const { startDate, endDate, propertyId, tenantId, status } = query;
  
  const where: any = {};
  if (propertyId) where.propertyId = propertyId;
  if (tenantId) where.tenantId = tenantId;
  if (status) where.status = status;
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
  }

  return Transaction.findAll({
    where,
    include: [
      { model: Property, as: 'property', attributes: ['name'] },
      { model: Tenant, as: 'tenant', attributes: ['name', 'email'] },
      { model: Unit, as: 'unit', attributes: ['unitNumber'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const createTransaction = async (data: any) => {
  return Transaction.create(data);
};

export const updateTransaction = async (id: string, data: any) => {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) throw new Error('Transaction not found');
  return transaction.update(data);
};

export const getFinancialStats = async () => {
  const totalRevenue = await Transaction.sum('amount', { where: { status: 'PAID' } });
  const pendingRevenue = await Transaction.sum('amount', { where: { status: 'PENDING' } });
  const overdueRevenue = await Transaction.sum('amount', { where: { status: 'OVERDUE' } });
  
  return {
    totalRevenue: totalRevenue || 0,
    pendingRevenue: pendingRevenue || 0,
    overdueRevenue: overdueRevenue || 0
  };
};
