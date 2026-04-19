import Property from '@models/Property.js';
import Unit from '@models/Unit.js';
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
