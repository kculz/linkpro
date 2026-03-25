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
  const totalUnits = properties.reduce((s, p) => s + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((s, p) => s + p.occupiedUnits, 0);
  const totalIncome = properties.reduce((s, p) => s + Number(p.monthlyIncome), 0);
  return {
    totalProperties: properties.length,
    totalUnits,
    occupiedUnits,
    vacantUnits: totalUnits - occupiedUnits,
    occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
    totalMonthlyIncome: totalIncome,
  };
};
