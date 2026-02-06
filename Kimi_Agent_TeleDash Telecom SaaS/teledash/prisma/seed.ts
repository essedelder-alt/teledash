import { PrismaClient, OrganizationRole, SubscriptionTier, TicketCategory, Priority, InteractionType, Direction, PaymentMethod, TransactionType, CustomerStatus, ChurnRiskLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@teledash.io' },
    update: {},
    create: {
      email: 'admin@teledash.io',
      name: 'System Administrator',
      password: adminPassword,
      emailVerified: new Date(),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created admin user');

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'telecel-ghana' },
    update: {},
    create: {
      name: 'Telecel Ghana',
      slug: 'telecel-ghana',
      description: 'Leading telecommunications provider in Ghana',
      ownerId: admin.id,
      subscriptionTier: SubscriptionTier.PROFESSIONAL,
      subscriptionStatus: 'ACTIVE',
      settings: {
        create: {
          enableChurnPrediction: true,
          enableNetworkMonitoring: true,
          enableWorkflowBuilder: true,
          enableMobileMoney: true,
        },
      },
    },
  });
  console.log('✅ Created demo organization: Telecel Ghana');

  // Add admin as organization owner
  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: demoOrg.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      userId: admin.id,
      role: OrganizationRole.OWNER,
    },
  });

  // Create agent users
  const agents = await Promise.all([
    createAgent('amara.kwame@telecel.com.gh', 'Amara Kwame', 'AG001'),
    createAgent('jordan.tetteh@telecel.com.gh', 'Jordan Tetteh', 'AG002'),
    createAgent('priya.mensah@telecel.com.gh', 'Priya Mensah', 'AG003'),
    createAgent('kwesi.boateng@telecel.com.gh', 'Kwesi Boateng', 'AG004'),
  ]);
  console.log('✅ Created agent users');

  // Add agents to organization
  for (const agent of agents) {
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: demoOrg.id,
          userId: agent.id,
        },
      },
      update: {},
      create: {
        organizationId: demoOrg.id,
        userId: agent.id,
        role: OrganizationRole.AGENT,
      },
    });

    // Create agent profiles
    await prisma.agentProfile.upsert({
      where: { userId: agent.id },
      update: {},
      create: {
        userId: agent.id,
        employeeId: `EMP${agent.id.slice(-4).toUpperCase()}`,
        department: 'Customer Support',
        skills: ['Billing', 'Technical Support', 'Sales'],
        languages: ['English', 'Twi'],
        isOnline: true,
        currentStatus: 'ONLINE',
      },
    });
  }

  // Create sample customers
  const customers = await Promise.all([
    createCustomer(demoOrg.id, '233241234567', 'Kwame Asante', 'kwame.asante@email.com', 'GREATER_ACCRA', 'Accra', 'Telecel', 'POSTPAID'),
    createCustomer(demoOrg.id, '233201234567', 'Akosua Mensah', 'akosua.m@email.com', 'ASHANTI', 'Kumasi', 'MTN', 'PREPAID'),
    createCustomer(demoOrg.id, '233501234567', 'Yaw Boateng', 'yaw.boateng@email.com', 'WESTERN', 'Takoradi', 'Telecel', 'POSTPAID'),
    createCustomer(demoOrg.id, '233271234567', 'Abena Osei', 'abena.osei@email.com', 'CENTRAL', 'Cape Coast', 'AirtelTigo', 'PREPAID'),
    createCustomer(demoOrg.id, '233551234567', 'Kofi Addo', 'kofi.addo@email.com', 'EASTERN', 'Koforidua', 'MTN', 'POSTPAID'),
    createCustomer(demoOrg.id, '233241234568', 'Efua Danso', 'efua.danso@email.com', 'GREATER_ACCRA', 'Tema', 'Telecel', 'PREPAID'),
    createCustomer(demoOrg.id, '233201234568', 'Kwesi Appiah', 'kwesi.a@email.com', 'ASHANTI', 'Obuasi', 'MTN', 'PREPAID'),
    createCustomer(demoOrg.id, '233501234568', 'Ama Serwah', 'ama.s@email.com', 'NORTHERN', 'Tamale', 'Telecel', 'POSTPAID'),
  ]);
  console.log('✅ Created sample customers');

  // Create sample tickets
  await Promise.all([
    createTicket(demoOrg.id, customers[0].id, 'Billing dispute for last month', 'I was charged twice for my data bundle last month. Please review my account.', TicketCategory.BILLING, Priority.HIGH),
    createTicket(demoOrg.id, customers[1].id, 'SIM swap request', 'I lost my phone and need to swap my SIM to a new number.', TicketCategory.TECHNICAL, Priority.MEDIUM),
    createTicket(demoOrg.id, customers[2].id, 'Network complaint - Poor coverage', 'Experiencing very poor network coverage in my area for the past week.', TicketCategory.TECHNICAL, Priority.HIGH),
    createTicket(demoOrg.id, customers[3].id, 'Roaming setup inquiry', 'Traveling to Nigeria next week. How do I activate roaming?', TicketCategory.ROAMING, Priority.LOW),
    createTicket(demoOrg.id, customers[4].id, 'Porting request from MTN', 'I want to port my number from MTN to Telecel. What is the process?', TicketCategory.PORTING, Priority.MEDIUM),
  ]);
  console.log('✅ Created sample tickets');

  // Create sample interactions
  await Promise.all([
    createInteraction(demoOrg.id, customers[0].id, InteractionType.CALL, Direction.INBOUND, 180, 'Billing inquiry resolved'),
    createInteraction(demoOrg.id, customers[1].id, InteractionType.SMS, Direction.OUTBOUND, null, 'SIM swap confirmation sent'),
    createInteraction(demoOrg.id, customers[2].id, InteractionType.CALL, Direction.INBOUND, 300, 'Network issue escalated to technical team'),
    createInteraction(demoOrg.id, customers[3].id, InteractionType.CALL, Direction.OUTBOUND, 120, 'Roaming package explained'),
  ]);
  console.log('✅ Created sample interactions');

  // Create sample transactions
  await Promise.all([
    createTransaction(demoOrg.id, customers[0].id, TransactionType.TOPUP, 50.00, PaymentMethod.MOBILE_MONEY, 'MTN'),
    createTransaction(demoOrg.id, customers[1].id, TransactionType.PAYMENT, 120.00, PaymentMethod.MOBILE_MONEY, 'Telecel'),
    createTransaction(demoOrg.id, customers[2].id, TransactionType.TOPUP, 25.00, PaymentMethod.MOBILE_MONEY, 'AirtelTigo'),
    createTransaction(demoOrg.id, customers[3].id, TransactionType.PAYMENT, 200.00, PaymentMethod.CARD, null),
  ]);
  console.log('✅ Created sample transactions');

  // Create sample network alerts
  await Promise.all([
    createNetworkAlert(demoOrg.id, 'OUTAGE', 'HIGH', 'Network outage in East Legon', 'Complete service disruption reported in East Legon area', 'GREATER_ACCRA', 'Accra'),
    createNetworkAlert(demoOrg.id, 'DEGRADATION', 'MEDIUM', 'Slow data speeds in Kumasi', 'Users reporting slow 4G speeds in Kumasi central', 'ASHANTI', 'Kumasi'),
  ]);
  console.log('✅ Created sample network alerts');

  // Create sample templates
  await Promise.all([
    createTemplate(demoOrg.id, 'Default Dashboard', 'Standard agent dashboard layout', 'DASHBOARD'),
    createTemplate(demoOrg.id, 'Churn Risk Workflow', 'Automated workflow for high churn risk customers', 'WORKFLOW'),
    createTemplate(demoOrg.id, 'Monthly Performance Report', 'Standard monthly agent performance report', 'REPORT'),
  ]);
  console.log('✅ Created sample templates');

  // Create usage stats
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.usageStat.create({
      data: {
        organizationId: demoOrg.id,
        date: new Date(date.setHours(0, 0, 0, 0)),
        totalCalls: Math.floor(Math.random() * 5000) + 1000,
        totalCallDuration: Math.floor(Math.random() * 300000) + 60000,
        totalDataUsed: BigInt(Math.floor(Math.random() * 1000000000000)),
        totalSMS: Math.floor(Math.random() * 10000) + 2000,
        totalRevenue: Math.random() * 50000 + 10000,
        activeCustomers: Math.floor(Math.random() * 5000) + 10000,
        newCustomers: Math.floor(Math.random() * 100) + 10,
        churnedCustomers: Math.floor(Math.random() * 50),
      },
    });
  }
  console.log('✅ Created usage stats for last 30 days');

  // Create agent performance records
  for (const agent of agents) {
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      await prisma.agentPerformance.create({
        data: {
          organizationId: demoOrg.id,
          agentId: agent.id,
          date: new Date(date.setHours(0, 0, 0, 0)),
          ticketsHandled: Math.floor(Math.random() * 30) + 10,
          ticketsResolved: Math.floor(Math.random() * 25) + 8,
          avgHandleTime: Math.floor(Math.random() * 600) + 300,
          firstContactResolution: Math.random() * 30 + 60,
          csatScore: Math.random() * 1.5 + 3.5,
          callsAnswered: Math.floor(Math.random() * 50) + 20,
          avgCallDuration: Math.floor(Math.random() * 300) + 120,
          performanceScore: Math.random() * 30 + 70,
        },
      });
    }
  }
  console.log('✅ Created agent performance records');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('  Admin: admin@teledash.io / admin123');
  console.log('  Organization: Telecel Ghana');
}

async function createAgent(email: string, name: string, employeeId: string) {
  const password = await bcrypt.hash('agent123', 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password,
      emailVerified: new Date(),
      status: 'ACTIVE',
    },
  });
}

async function createCustomer(
  orgId: string,
  phone: string,
  name: string,
  email: string | null,
  region: string,
  city: string,
  provider: string,
  planType: string
) {
  const customerCode = `CUST${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return prisma.customer.create({
    data: {
      organizationId: orgId,
      customerCode,
      phoneNumber: phone,
      name,
      email,
      region,
      city,
      networkProvider: provider,
      planType,
      accountBalance: Math.random() * 500,
      status: CustomerStatus.ACTIVE,
      churnScore: Math.random() * 100,
      churnRisk: Math.random() > 0.7 ? ChurnRiskLevel.HIGH : Math.random() > 0.4 ? ChurnRiskLevel.MEDIUM : ChurnRiskLevel.LOW,
      consentGiven: true,
      consentDate: new Date(),
    },
  });
}

async function createTicket(
  orgId: string,
  customerId: string,
  subject: string,
  description: string,
  category: TicketCategory,
  priority: Priority
) {
  const ticketCount = await prisma.ticket.count({ where: { organizationId: orgId } });
  const ticketNumber = `#${4800 + ticketCount + 1}`;
  
  return prisma.ticket.create({
    data: {
      organizationId: orgId,
      ticketNumber,
      customerId,
      subject,
      description,
      category,
      priority,
    },
  });
}

async function createInteraction(
  orgId: string,
  customerId: string,
  type: InteractionType,
  direction: Direction,
  duration: number | null,
  notes: string
) {
  const startedAt = new Date();
  startedAt.setMinutes(startedAt.getMinutes() - Math.floor(Math.random() * 60));
  
  return prisma.interaction.create({
    data: {
      organizationId: orgId,
      customerId,
      type,
      direction,
      status: 'COMPLETED',
      startedAt,
      endedAt: duration ? new Date(startedAt.getTime() + duration * 1000) : null,
      duration,
      notes,
    },
  });
}

async function createTransaction(
  orgId: string,
  customerId: string,
  type: TransactionType,
  amount: number,
  method: PaymentMethod,
  provider: string | null
) {
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  return prisma.transaction.create({
    data: {
      organizationId: orgId,
      customerId,
      transactionId,
      type,
      amount,
      paymentMethod: method,
      provider: provider || undefined,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
}

async function createNetworkAlert(
  orgId: string,
  alertType: string,
  severity: string,
  title: string,
  description: string,
  region: string,
  city: string
) {
  return prisma.networkAlert.create({
    data: {
      organizationId: orgId,
      alertType: alertType as any,
      severity: severity as any,
      title,
      description,
      region,
      city,
      status: 'ACTIVE',
      affectedCustomers: Math.floor(Math.random() * 1000) + 100,
    },
  });
}

async function createTemplate(
  orgId: string,
  name: string,
  description: string,
  type: string
) {
  return prisma.template.create({
    data: {
      organizationId: orgId,
      name,
      description,
      type: type as any,
      content: {},
      isSystem: false,
      isActive: true,
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
