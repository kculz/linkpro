import Transaction from '@models/Transaction.js';
import Property from '@models/Property.js';
import Tenant from '@models/Tenant.js';
import Unit from '@models/Unit.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';

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

// ──────────────────────────────────────────────
// Finance Intelligence — Rich aggregation queries
// ──────────────────────────────────────────────

/**
 * Monthly revenue trend for the last 12 months.
 * Returns [{month: '2026-01', paid: 12000, total: 15000}, …]
 */
export const getMonthlyRevenueTrend = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const rows: any[] = await Transaction.findAll({
    attributes: [
      [fn('TO_CHAR', fn('DATE_TRUNC', 'month', col('createdAt')), 'YYYY-MM'), 'month'],
      [fn('SUM', literal("CASE WHEN status = 'PAID' THEN amount ELSE 0 END")), 'paid'],
      [fn('SUM', col('amount')), 'total']
    ],
    where: { createdAt: { [Op.gte]: twelveMonthsAgo } },
    group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
    order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
    raw: true
  });

  return rows.map((r: any) => ({
    month: r.month,
    paid: Number(r.paid) || 0,
    total: Number(r.total) || 0
  }));
};

/**
 * Revenue breakdown by transaction type.
 * Returns [{type: 'RENT', amount: 40000}, …]
 */
export const getRevenueByType = async () => {
  const rows: any[] = await Transaction.findAll({
    attributes: [
      'type',
      [fn('SUM', col('amount')), 'amount']
    ],
    where: { status: 'PAID' },
    group: ['type'],
    raw: true
  });

  return rows.map((r: any) => ({
    type: r.type,
    amount: Number(r.amount) || 0
  }));
};

/**
 * Top 5 properties ranked by collected revenue.
 */
export const getRevenueByProperty = async () => {
  const rows: any[] = await Transaction.findAll({
    attributes: [
      'propertyId',
      [fn('SUM', col('amount')), 'revenue']
    ],
    where: { status: 'PAID' },
    group: ['propertyId'],
    order: [[fn('SUM', col('amount')), 'DESC']],
    limit: 5,
    raw: true
  });

  // Enrich with property details
  const propertyIds = rows.map((r: any) => r.propertyId);
  const properties = await Property.findAll({
    where: { id: { [Op.in]: propertyIds } },
    attributes: ['id', 'name', 'totalUnits', 'occupiedUnits'],
    raw: true
  });
  const propMap = new Map(properties.map((p: any) => [p.id, p]));

  return rows.map((r: any) => ({
    propertyId: r.propertyId,
    revenue: Number(r.revenue) || 0,
    name: (propMap.get(r.propertyId) as any)?.name || 'Unknown',
    totalUnits: (propMap.get(r.propertyId) as any)?.totalUnits || 0,
    occupiedUnits: (propMap.get(r.propertyId) as any)?.occupiedUnits || 0
  }));
};

/**
 * Income vs Expenses summary.
 * Income = RENT + DEPOSIT; Expenses = MAINTENANCE + OTHER
 */
export const getCashFlowSummary = async () => {
  const [income, expenses] = await Promise.all([
    Transaction.sum('amount', {
      where: { status: 'PAID', type: { [Op.in]: ['RENT', 'DEPOSIT'] } }
    }),
    Transaction.sum('amount', {
      where: { status: 'PAID', type: { [Op.in]: ['MAINTENANCE', 'OTHER'] } }
    })
  ]);

  return {
    income: Number(income) || 0,
    expenses: Number(expenses) || 0,
    netCashFlow: (Number(income) || 0) - (Number(expenses) || 0)
  };
};

/**
 * Monthly collection rate (last 6 months).
 * Returns [{month: '2026-01', rate: 94.5}, …]
 */
export const getCollectionRateTrend = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const rows: any[] = await Transaction.findAll({
    attributes: [
      [fn('TO_CHAR', fn('DATE_TRUNC', 'month', col('createdAt')), 'YYYY-MM'), 'month'],
      [fn('SUM', col('amount')), 'total'],
      [fn('SUM', literal("CASE WHEN status = 'PAID' THEN amount ELSE 0 END")), 'paid']
    ],
    where: { createdAt: { [Op.gte]: sixMonthsAgo } },
    group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
    order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
    raw: true
  });

  return rows.map((r: any) => ({
    month: r.month,
    rate: r.total > 0 ? Math.round((Number(r.paid) / Number(r.total)) * 1000) / 10 : 0
  }));
};

/**
 * Recent 15 transactions for live feed.
 */
export const getRecentTransactions = async () => {
  return Transaction.findAll({
    include: [
      { model: Property, as: 'property', attributes: ['name'] },
      { model: Tenant, as: 'tenant', attributes: ['name', 'email'] },
      { model: Unit, as: 'unit', attributes: ['unitNumber'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: 15
  });
};

/**
 * Consolidated finance intelligence payload.
 */
export const getFinanceIntelligence = async () => {
  const [
    monthlyTrend,
    revenueByType,
    revenueByProperty,
    cashFlow,
    collectionRate,
    recentTransactions,
    basicStats
  ] = await Promise.all([
    getMonthlyRevenueTrend(),
    getRevenueByType(),
    getRevenueByProperty(),
    getCashFlowSummary(),
    getCollectionRateTrend(),
    getRecentTransactions(),
    getFinancialStats()
  ]);

  return {
    ...basicStats,
    monthlyTrend,
    revenueByType,
    revenueByProperty,
    cashFlow,
    collectionRate,
    recentTransactions
  };
};
