import Vendor from '@models/Vendor.js';
import MaintenanceRequest from '@models/MaintenanceRequest.js';

export const getAllVendors = async (query: any = {}) => {
  return Vendor.findAll({
    where: query,
    order: [['name', 'ASC']]
  });
};

export const getVendorById = async (id: string) => {
  return Vendor.findByPk(id, {
    include: [{ model: MaintenanceRequest, as: 'requests' }]
  });
};

export const createVendor = async (data: any) => {
  return Vendor.create(data);
};

export const updateVendor = async (id: string, data: any) => {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor.update(data);
};

export const deleteVendor = async (id: string) => {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor.destroy();
};
