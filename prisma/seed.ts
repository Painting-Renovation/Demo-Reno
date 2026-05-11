import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create owner
  const owner = await prisma.owner.upsert({
    where: { email: 'owner@procoatpainters.com' },
    update: {},
    create: {
      email: 'owner@procoatpainters.com',
      passwordHash: 'hashed_demo_password',
      name: 'James Mitchell',
      phone: '(416) 555-PAINT',
      company: 'ProCoat Painters',
      address: '123 Bay Street, Toronto, ON M5H 2V2',
    },
  });

  // Create sample testimonials
  const testimonials = [
    {
      name: 'Sarah Thompson',
      location: 'Downtown Toronto',
      rating: 5,
      text: 'ProCoat transformed our living room completely! The team was professional, punctual, and the quality of work exceeded our expectations. We could not be happier with the results.',
      service: 'Interior Painting',
      isFeatured: true,
      isApproved: true,
    },
    {
      name: 'Michael Chen',
      location: 'North York',
      rating: 5,
      text: 'Outstanding work on our exterior painting project. The crew was meticulous and finished ahead of schedule. Our home looks brand new! Highly recommend ProCoat to anyone.',
      service: 'Exterior Painting',
      isFeatured: true,
      isApproved: true,
    },
    {
      name: 'Jennifer Adams',
      location: 'Mississauga',
      rating: 5,
      text: 'The cabinet refinishing was absolutely incredible. They made our old kitchen look like a magazine cover. The attention to detail was remarkable from start to finish.',
      service: 'Cabinet Refinishing',
      isFeatured: true,
      isApproved: true,
    },
    {
      name: 'David Williams',
      location: 'Scarborough',
      rating: 4,
      text: 'Great communication throughout the project and the final result is beautiful. The team was respectful of our space and cleaned up perfectly each day.',
      service: 'Interior Painting',
      isFeatured: false,
      isApproved: true,
    },
    {
      name: 'Lisa Park',
      location: 'Markham',
      rating: 5,
      text: 'We hired ProCoat for our commercial space and they delivered exceptional results. Zero disruption to our business operations and the space looks fantastic.',
      service: 'Commercial Painting',
      isFeatured: true,
      isApproved: true,
    },
    {
      name: 'Robert Garcia',
      location: 'Oakville',
      rating: 5,
      text: 'Our deck and fence look absolutely stunning after the staining work. The team was professional and the price was very fair. Will definitely use them again next season.',
      service: 'Deck & Fence',
      isFeatured: false,
      isApproved: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `test-${t.name.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: { id: `test-${t.name.toLowerCase().replace(/\s/g, '-')}`, ...t },
    });
  }

  // Create sample gallery items
  const galleryItems = [
    {
      id: 'gal-1',
      title: 'Modern Living Room Transformation',
      description: 'Complete interior repaint in elegant warm gray',
      category: 'interior',
      afterUrl: '/images/hero-interior.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: 'gal-2',
      title: 'Victorian Home Exterior Refresh',
      description: 'Full exterior repaint preserving classic charm',
      category: 'exterior',
      afterUrl: '/images/hero-exterior.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      id: 'gal-3',
      title: 'Kitchen Cabinet Makeover',
      description: 'Dark wood cabinets refinished to modern espresso',
      category: 'cabinet',
      afterUrl: '/images/cabinet-refinish.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: true,
      sortOrder: 3,
    },
    {
      id: 'gal-4',
      title: 'Commercial Office Space',
      description: 'Modern professional repaint for corporate offices',
      category: 'commercial',
      afterUrl: '/images/commercial.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: false,
      sortOrder: 4,
    },
    {
      id: 'gal-5',
      title: 'Backyard Deck Restoration',
      description: 'Complete deck and fence staining and restoration',
      category: 'deck',
      afterUrl: '/images/deck-fence.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: true,
      sortOrder: 5,
    },
    {
      id: 'gal-6',
      title: 'Professional Painting Services',
      description: 'Expert painting team at work on residential project',
      category: 'interior',
      afterUrl: '/images/service-painting.jpg',
      beforeUrl: '/images/before-after.jpg',
      isFeatured: false,
      sortOrder: 6,
    },
  ];

  for (const g of galleryItems) {
    await prisma.galleryImage.upsert({
      where: { id: g.id },
      update: {},
      create: g,
    });
  }

  // Create notification settings
  await prisma.notificationSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: { id: 'default-settings' },
  });

  // Create sample leads for demo
  const sampleLeads = [
    {
      firstName: 'Sarah',
      lastName: 'Thompson',
      email: 'sarah.thompson@email.com',
      phone: '(416) 555-1234',
      address: '45 King Street West, Toronto',
      city: 'Toronto',
      postalCode: 'M5H 1C1',
      serviceType: 'Interior Painting',
      projectDesc: 'Full interior repaint of 3-bedroom home',
      budget: '$3,000-$5,000',
      howHeard: 'Google Search',
      leadSource: 'website',
      status: 'won',
      priority: 'high',
      funnelStage: 'purchase',
      estimatedValue: 4500,
      closedValue: 4200,
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'm.chen@email.com',
      phone: '(416) 555-5678',
      address: '78 Bayview Avenue, North York',
      city: 'North York',
      postalCode: 'M2N 5P3',
      serviceType: 'Exterior Painting',
      projectDesc: 'Exterior repaint of 2-story home',
      budget: '$5,000-$8,000',
      howHeard: 'Referral',
      leadSource: 'referral',
      status: 'qualified',
      priority: 'high',
      funnelStage: 'consideration',
      estimatedValue: 7000,
    },
    {
      firstName: 'Jennifer',
      lastName: 'Adams',
      email: 'j.adams@email.com',
      phone: '(905) 555-9012',
      address: '123 Queen Street, Mississauga',
      city: 'Mississauga',
      postalCode: 'L5M 1A2',
      serviceType: 'Cabinet Refinishing',
      projectDesc: 'Kitchen cabinet refinishing - 20 doors',
      budget: '$2,000-$4,000',
      howHeard: 'Instagram',
      leadSource: 'website',
      status: 'proposal',
      priority: 'medium',
      funnelStage: 'intent',
      estimatedValue: 3200,
    },
    {
      firstName: 'David',
      lastName: 'Williams',
      email: 'd.williams@email.com',
      phone: '(416) 555-3456',
      address: '456 Lawrence Avenue, Scarborough',
      city: 'Scarborough',
      postalCode: 'M1R 2X1',
      serviceType: 'Interior Painting',
      projectDesc: 'Living room and hallway repaint',
      budget: '$1,500-$2,500',
      howHeard: 'Website',
      leadSource: 'website',
      status: 'new',
      priority: 'medium',
      funnelStage: 'awareness',
      estimatedValue: 2000,
    },
    {
      firstName: 'Lisa',
      lastName: 'Park',
      email: 'lisa.park@email.com',
      phone: '(905) 555-7890',
      address: '789 Main Street, Markham',
      city: 'Markham',
      postalCode: 'L3R 5H2',
      serviceType: 'Commercial Painting',
      projectDesc: 'Office space repaint - approximately 3000 sq ft',
      budget: '$8,000-$12,000',
      howHeard: 'Google Search',
      leadSource: 'website',
      status: 'contacted',
      priority: 'high',
      funnelStage: 'interest',
      estimatedValue: 10000,
    },
    {
      firstName: 'Robert',
      lastName: 'Garcia',
      email: 'r.garcia@email.com',
      phone: '(905) 555-2345',
      address: '321 Lakeshore Road, Oakville',
      city: 'Oakville',
      postalCode: 'L6J 3A1',
      serviceType: 'Deck & Fence',
      projectDesc: 'Deck staining and fence painting',
      budget: '$1,500-$3,000',
      howHeard: 'Neighbor Referral',
      leadSource: 'referral',
      status: 'new',
      priority: 'low',
      funnelStage: 'awareness',
      estimatedValue: 2200,
    },
    {
      firstName: 'Amanda',
      lastName: 'Taylor',
      email: 'a.taylor@email.com',
      phone: '(416) 555-6789',
      address: '567 Dundas Street, Toronto',
      city: 'Toronto',
      postalCode: 'M5T 1G1',
      serviceType: 'Interior Painting',
      projectDesc: 'Bedroom and bathroom repaint - color consultation needed',
      budget: '$1,000-$2,000',
      howHeard: 'Facebook',
      leadSource: 'website',
      status: 'new',
      priority: 'medium',
      funnelStage: 'interest',
      estimatedValue: 1500,
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'j.wilson@email.com',
      phone: '(905) 555-4567',
      address: '890 Hurontario Street, Brampton',
      city: 'Brampton',
      postalCode: 'L6Y 4H8',
      serviceType: 'Exterior Painting',
      projectDesc: 'Full exterior repaint including trim and garage door',
      budget: '$4,000-$7,000',
      howHeard: 'Website',
      leadSource: 'website',
      status: 'lost',
      priority: 'medium',
      funnelStage: 'evaluation',
      estimatedValue: 5500,
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.upsert({
      where: { id: `lead-${lead.email}` },
      update: {},
      create: { id: `lead-${lead.email}`, ...lead },
    });
  }

  // Create sample appointments
  const sampleAppointments = [
    {
      id: 'apt-1',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'm.chen@email.com',
      phone: '(416) 555-5678',
      address: '78 Bayview Avenue, North York',
      serviceType: 'Exterior Painting',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 60,
      status: 'scheduled',
      notes: 'Client wants color consultation for exterior',
    },
    {
      id: 'apt-2',
      firstName: 'Lisa',
      lastName: 'Park',
      email: 'lisa.park@email.com',
      phone: '(905) 555-7890',
      address: '789 Main Street, Markham',
      serviceType: 'Commercial Painting',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      duration: 90,
      status: 'scheduled',
      notes: 'Large commercial space - need detailed assessment',
    },
    {
      id: 'apt-3',
      firstName: 'Amanda',
      lastName: 'Taylor',
      email: 'a.taylor@email.com',
      phone: '(416) 555-6789',
      address: '567 Dundas Street, Toronto',
      serviceType: 'Interior Painting',
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      duration: 45,
      status: 'scheduled',
      notes: 'Color consultation for bedroom and bathroom',
    },
  ];

  for (const apt of sampleAppointments) {
    await prisma.appointment.upsert({
      where: { id: apt.id },
      update: {},
      create: apt,
    });
  }

  // Create sample projects
  const sampleProjects = [
    {
      id: 'proj-1',
      leadId: 'lead-sarah.thompson@email.com',
      name: 'Thompson Interior Repaint',
      // Note: lead email is sarah.thompson@email.com
      description: 'Full interior repaint of 3-bedroom home in downtown Toronto',
      serviceType: 'Interior Painting',
      status: 'completed',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      estimatedCost: 4500,
      actualCost: 4200,
      address: '45 King Street West, Toronto',
      teamMembers: '["Mike R.", "Jason T.", "Carlos M."]',
    },
    {
      id: 'proj-2',
      leadId: 'lead-j.adams@email.com',
      name: 'Adams Cabinet Refinishing',
      description: 'Kitchen cabinet refinishing - 20 doors and 8 drawer fronts',
      serviceType: 'Cabinet Refinishing',
      status: 'in-progress',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estimatedCost: 3200,
      address: '123 Queen Street, Mississauga',
      teamMembers: '["Sarah K.", "Tom B."]',
    },
  ];

  for (const proj of sampleProjects) {
    await prisma.project.create({
      data: proj,
    });
  }

  // Create sample quotes
  const sampleQuotes = [
    {
      id: 'quote-1',
      leadId: 'lead-j.adams@email.com',
      projectId: 'proj-2',
      title: 'Kitchen Cabinet Refinishing Quote',
      items: JSON.stringify([
        { description: 'Cabinet door refinishing (20 doors)', qty: 20, unitCost: 85 },
        { description: 'Drawer front refinishing (8 fronts)', qty: 8, unitCost: 65 },
        { description: 'Hardware replacement', qty: 28, unitCost: 15 },
        { description: 'Surface preparation & cleanup', qty: 1, unitCost: 250 },
      ]),
      subtotal: 2810,
      tax: 365.3,
      total: 3175.3,
      status: 'sent',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'quote-2',
      leadId: 'lead-m.chen@email.com',
      title: 'Exterior Painting Estimate',
      items: JSON.stringify([
        { description: 'Exterior surface preparation', qty: 1, unitCost: 800 },
        { description: 'Primer coat (full exterior)', qty: 1, unitCost: 1500 },
        { description: 'Two finish coats (premium paint)', qty: 2, unitCost: 2200 },
        { description: 'Trim and accent painting', qty: 1, unitCost: 600 },
        { description: 'Cleanup and disposal', qty: 1, unitCost: 200 },
      ]),
      subtotal: 5300,
      tax: 689,
      total: 5989,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const q of sampleQuotes) {
    await prisma.quote.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });
  }

  // Create site audit entries
  const auditMetrics = [
    { id: 'audit-1', metric: 'page_view', value: 156, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'audit-2', metric: 'estimate_request', value: 12, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'audit-3', metric: 'phone_click', value: 8, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'audit-4', metric: 'appointment_booking', value: 6, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'audit-5', metric: 'form_submission', value: 15, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'audit-6', metric: 'page_view', value: 245, date: new Date() },
    { id: 'audit-7', metric: 'estimate_request', value: 18, date: new Date() },
    { id: 'audit-8', metric: 'phone_click', value: 11, date: new Date() },
    { id: 'audit-9', metric: 'appointment_booking', value: 9, date: new Date() },
    { id: 'audit-10', metric: 'form_submission', value: 22, date: new Date() },
  ];

  for (const a of auditMetrics) {
    await prisma.siteAudit.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }

  console.log('Seed data created successfully!');
  console.log('Owner:', owner.email);
  console.log('Leads:', sampleLeads.length);
  console.log('Testimonials:', testimonials.length);
  console.log('Gallery items:', galleryItems.length);
  console.log('Projects:', sampleProjects.length);
  console.log('Appointments:', sampleAppointments.length);
  console.log('Quotes:', sampleQuotes.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
