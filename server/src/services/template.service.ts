import Template from '@models/Template.js';

export const getAllTemplates = async () => {
  return Template.findAll({ order: [['name', 'ASC']] });
};

export const getTemplateById = async (id: string) => {
  return Template.findByPk(id);
};

export const createTemplate = async (data: any) => {
  return Template.create(data);
};

export const deleteTemplate = async (id: string) => {
  const template = await Template.findByPk(id);
  if (!template) throw new Error('Template not found');
  return template.destroy();
};

export const seedDefaultTemplates = async (userId: string) => {
  const existing = await Template.findOne({ where: { name: 'Standard Residential Lease' } });
  if (existing) return;

  const content = `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6;">
      <h1 style="text-align: center; color: #000; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px;">Residential Lease Agreement</h1>
      
      <p style="text-align: right; margin-bottom: 40px;"><strong>Date:</strong> {{current_date}}</p>

      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">1. PARTIES</h2>
        <p>This Lease Agreement is made between <strong>{{landlord_name}}</strong> (Landlord) and <strong>{{tenant_name}}</strong> (Tenant).</p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">2. PROPERTY</h2>
        <p>The Landlord agrees to rent to the Tenant the property located at:</p>
        <p style="padding-left: 20px;"><strong>{{property_address}}</strong><br>Unit: <strong>{{unit_number}}</strong></p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">3. TERM</h2>
        <p>The term of this lease shall begin on <strong>{{start_date}}</strong> and end on <strong>{{end_date}}</strong>.</p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">4. RENT</h2>
        <p>The monthly rent for the property is <strong>{{monthly_rent}}</strong>, payable on the first day of each month.</p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">5. SECURITY DEPOSIT</h2>
        <p>A security deposit of <strong>{{security_deposit}}</strong> is required upon signing this agreement.</p>
      </section>

      <section style="margin-bottom: 80px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">6. SIGNATURES</h2>
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div style="width: 45%;">
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <p style="font-size: 12px;">Landlord Signature</p>
          </div>
          <div style="width: 45%;">
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <p style="font-size: 12px;">Tenant Signature</p>
          </div>
        </div>
      </section>
      
      <p style="font-size: 10px; color: #999; text-align: center;">Generated via LinkPro AI Asset Management</p>
    </div>
  `;

  await Template.create({
    name: 'Standard Residential Lease',
    type: 'LEASE',
    content,
    description: 'A professional residential lease agreement for tenants and properties.',
    createdBy: userId
  });
};
