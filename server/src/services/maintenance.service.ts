import MaintenanceRequest from '@models/MaintenanceRequest.js';
import Property from '@models/Property.js';
import Unit from '@models/Unit.js';
import Tenant from '@models/Tenant.js';

export const getAllRequests = async (query: any = {}) => {
  return MaintenanceRequest.findAll({
    where: query,
    include: [
      { model: Property, as: 'property', attributes: ['name', 'address'] },
      { model: Unit, as: 'unit', attributes: ['unitNumber'] },
      { model: Tenant, as: 'tenant', attributes: ['name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const getRequestById = async (id: string) => {
  return MaintenanceRequest.findByPk(id, {
    include: [
      { model: Property, as: 'property' },
      { model: Unit, as: 'unit' },
      { model: Tenant, as: 'tenant' }
    ]
  });
};

export const createRequest = async (data: any) => {
  return MaintenanceRequest.create(data);
};

export const updateRequest = async (id: string, data: any) => {
  const request = await MaintenanceRequest.findByPk(id);
  if (!request) throw new Error('Maintenance request not found');
  return request.update(data);
};

export const deleteRequest = async (id: string) => {
  const request = await MaintenanceRequest.findByPk(id);
  if (!request) throw new Error('Maintenance request not found');
  return request.destroy();
};
