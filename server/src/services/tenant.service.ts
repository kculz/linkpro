import Tenant from '@models/Tenant.js';
import Unit from '@models/Unit.js';
import Property from '@models/Property.js';

export const getAllTenants = async (query: any = {}) => {
  return Tenant.findAll({
    where: query,
    include: [
      { 
        model: Unit, 
        as: 'unit',
        include: [{ model: Property, as: 'property', attributes: ['name', 'address'] }]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const getTenantById = async (id: string) => {
  return Tenant.findByPk(id, {
    include: [
      { 
        model: Unit, 
        as: 'unit',
        include: [{ model: Property, as: 'property' }]
      }
    ]
  });
};

export const createTenant = async (data: any) => {
  const tenant = await Tenant.create(data);
  // Mark unit as occupied
  await Unit.update({ status: 'OCCUPIED' }, { where: { id: data.unitId } });
  return tenant;
};

export const updateTenant = async (id: string, data: any) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw new Error('Tenant not found');
  
  if (data.unitId && data.unitId !== tenant.unitId) {
    // Release old unit
    await Unit.update({ status: 'VACANT' }, { where: { id: tenant.unitId } });
    // Occupy new unit
    await Unit.update({ status: 'OCCUPIED' }, { where: { id: data.unitId } });
  }
  
  return tenant.update(data);
};

export const deleteTenant = async (id: string) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw new Error('Tenant not found');
  
  // Release unit
  await Unit.update({ status: 'VACANT' }, { where: { id: tenant.unitId } });
  
  return tenant.destroy();
};
