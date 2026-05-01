import Property from '@models/Property.js';
import Unit from '@models/Unit.js';
import Tenant from '@models/Tenant.js';
import MaintenanceRequest from '@models/MaintenanceRequest.js';
import Transaction from '@models/Transaction.js';
import Document from '@models/Document.js';
import { AppError } from '@middlewares/errorHandler.js';

export const getAllProperties = async () =>
  Property.findAll({ include: [{ model: Unit, as: 'units' }] });

export const getPropertyById = async (id: string) => {
  const property = await Property.findByPk(id, { include: [{ model: Unit, as: 'units' }] });
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

export const createProperty = async (data: Record<string, unknown>) =>
  Property.create(data as Parameters<typeof Property.create>[0]);

export const updateProperty = async (id: string, data: Record<string, unknown>) => {
  const property = await Property.findByPk(id);
  if (!property) throw new AppError('Property not found', 404);
  return property.update(data);
};

export const deleteProperty = async (id: string) => {
  const property = await Property.findByPk(id);
  if (!property) throw new AppError('Property not found', 404);
  await property.destroy();
};

export const getOccupancyStats = async () => {
  const properties = await Property.findAll();
  
  const stats = properties.reduce(
    (acc, p) => {
      acc.totalProperties += 1;
      acc.totalUnits += Number(p.totalUnits) || 0;
      acc.occupiedUnits += Number(p.occupiedUnits) || 0;
      acc.totalMonthlyIncome += Number(p.monthlyIncome) || 0;
      return acc;
    },
    { totalProperties: 0, totalUnits: 0, occupiedUnits: 0, totalMonthlyIncome: 0 }
  );

  return {
    ...stats,
    vacantUnits: stats.totalUnits - stats.occupiedUnits,
    occupancyRate: stats.totalUnits > 0 ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0,
  };
};

export const createUnit = async (data: any) => {
  return Unit.create(data);
};

export const updateUnit = async (id: string, data: any) => {
  const unit = await Unit.findByPk(id);
  if (!unit) throw new Error('Unit not found');
  return unit.update(data);
};

export const deleteUnit = async (id: string) => {
  const unit = await Unit.findByPk(id);
  if (!unit) throw new Error('Unit not found');
  return unit.destroy();
};

export const getUnitById = async (id: string) => {
  return Unit.findByPk(id, {
    include: [
      { model: Tenant, as: 'tenant' },
      { 
        model: MaintenanceRequest, 
        as: 'maintenanceRequests',
        include: [{ model: Property, as: 'property', attributes: ['name'] }]
      },
      { model: Transaction, as: 'transactions' },
      { 
        model: Document, 
        as: 'documents',
        where: { targetType: 'UNIT' },
        required: false
      },
      { model: Property, as: 'property', attributes: ['name', 'address'] }
    ]
  });
};
