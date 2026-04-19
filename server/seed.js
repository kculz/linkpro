import Property from './src/models/Property.js';
import Unit from './src/models/Unit.js';
import Project from './src/models/Project.js';
import Task from './src/models/Task.js';
import User from './src/models/User.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    // 1. Create a dummy owner/admin if none exists
    let owner = await User.findOne({ where: { email: 'admin@linkpro.com' } });
    if (!owner) {
      owner = await User.create({
        id: uuidv4(),
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@linkpro.com',
        phone: '+1234567890',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true
      });
    }

    // 2. Create Sample Properties
    const properties = [
      {
        id: uuidv4(),
        name: 'Sunset Villas',
        type: 'RESIDENTIAL',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        totalUnits: 0,
        occupiedUnits: 0,
        monthlyIncome: 24600,
        ownerId: owner.id,
        status: 'ACTIVE'
      },
      {
        id: uuidv4(),
        name: 'Metro Office Building',
        type: 'COMMERCIAL',
        address: '456 Business Ave',
        city: 'Cityview',
        state: 'NY',
        totalUnits: 0,
        occupiedUnits: 0,
        monthlyIncome: 34500,
        ownerId: owner.id,
        status: 'ACTIVE'
      }
    ];

    for (const p of properties) {
      const createdProperty = await Property.create(p);
      
      // 3. Create Units for each property
      const unitTypes = ['STUDIO', '1BHK', '2BHK', 'OFFICE'];
      for (let i = 1; i <= 5; i++) {
        const status = i % 3 === 0 ? 'VACANT' : 'OCCUPIED';
        await Unit.create({
          id: uuidv4(),
          propertyId: createdProperty.id,
          unitNumber: `${p.name[0]}${i}0${i}`,
          type: unitTypes[i % 4],
          floorArea: 50 + (i * 10),
          rent: 1200 + (i * 200),
          status: status
        });

        // Update counts
        await createdProperty.increment('totalUnits');
        if (status === 'OCCUPIED') {
          await createdProperty.increment('occupiedUnits');
        }
      }
    }

    // 4. Create Sample Projects
    const projectList = [
      {
        id: uuidv4(),
        name: 'Riverside Pool Renovation',
        type: 'RENOVATION',
        description: 'Upgrading the main pool deck and lighting systems.',
        status: 'IN_PROGRESS',
        budget: 45000,
        spent: 12000,
        progress: 35,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        managerId: owner.id,
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const projData of projectList) {
      const project = await Project.create(projData);

      // 5. Create Tasks (Kanban)
      const tasks = [
        { title: 'Drain Pool', status: 'DONE', priority: 'HIGH' },
        { title: 'Inspect Substrate', status: 'DONE', priority: 'MEDIUM' },
        { title: 'Order Tiles', status: 'IN_PROGRESS', priority: 'URGENT' },
        { title: 'Install New Filter', status: 'TODO', priority: 'HIGH' },
        { title: 'Test Lighting', status: 'BACKLOG', priority: 'LOW' }
      ];

      for (const t of tasks) {
        await Task.create({
          id: uuidv4(),
          projectId: project.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          assigneeId: owner.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
