import Unit from '@models/Unit.js';
import Property from '@models/Property.js';
import { AppError } from '@middlewares/errorHandler.js';

export const getAllUnits = async (query: any = {}) => {
  return Unit.findAll({ where: query, include: [{ model: Property, as: 'property' }] });
};

export const getUnitById = async (id: string) => {
  const unit = await Unit.findByPk(id, { include: [{ model: Property, as: 'property' }] });
  if (!unit) throw new AppError('Unit not found', 404);
  return unit;
};

export const createUnit = async (data: any) => {
  const property = await Property.findByPk(data.propertyId);
  if (!property) throw new AppError('Property not found', 404);

  const unit = await Unit.create(data);
  
  // Update property total units count
  await property.increment('totalUnits');
  
  return unit;
};

export const updateUnit = async (id: string, data: any) => {
  const unit = await Unit.findByPk(id);
  if (!unit) throw new AppError('Unit not found', 404);

  const oldStatus = unit.status;
  const updatedUnit = await unit.update(data);

  // If status changed to/from OCCUPIED, update property occupied count
  if (data.status && data.status !== oldStatus) {
    const property = await Property.findByPk(unit.propertyId);
    if (property) {
      if (data.status === 'OCCUPIED' && oldStatus !== 'OCCUPIED') {
        await property.increment('occupiedUnits');
      } else if (oldStatus === 'OCCUPIED' && data.status !== 'OCCUPIED') {
        await property.decrement('occupiedUnits');
      }
    }
  }

  return updatedUnit;
};

export const deleteUnit = async (id: string) => {
  const unit = await Unit.findByPk(id);
  if (!unit) throw new AppError('Unit not found', 404);

  const property = await Property.findByPk(unit.propertyId);
  if (property) {
    await property.decrement('totalUnits');
    if (unit.status === 'OCCUPIED') {
      await property.decrement('occupiedUnits');
    }
  }

  await unit.destroy();
};
