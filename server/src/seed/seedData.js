require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const NGO = require('../models/NGO');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const TreatmentUpdate = require('../models/TreatmentUpdate');
const FundAllocation = require('../models/FundAllocation');
const HospitalPartnership = require('../models/HospitalPartnership');
const CaseTransfer = require('../models/CaseTransfer');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medifund';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database:', mongoUri);

    // Drop database to remove any legacy indexes
    await mongoose.connection.db.dropDatabase();
    console.log('[Seed] Dropped existing medifund database and indexes.');

    // 1. Create Default Users & Authorized Admins from Environment Variables
    const defaultPasswordHash = await User.hashPassword('password123');

    const adminEmails = Array.from(new Set([
      ...(process.env.ADMIN_EMAILS || 'reshmagujjuka4@gmail.com,anjalikore775@gmail.com,admin@medifund.org')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean),
      'reshmagujjuka4@gmail.com',
      'anjalikore775@gmail.com',
      'admin@medifund.org'
    ])).filter(Boolean);

    const adminPasswordMap = {
      'reshmagujjuka4@gmail.com': 'reshma@123',
      'anjalikore775@gmail.com': 'anjali@07',
      'admin@medifund.org': 'password123'
    };

    const adminUsers = await Promise.all(adminEmails.map(async (email, index) => User.create({
      fullName: email === 'reshmagujjuka4@gmail.com'
        ? 'Reshma Gujjuka (Administrator)'
        : email === 'anjalikore775@gmail.com'
          ? 'Anjali Kore (Administrator)'
          : 'MediFund Admin',
      email,
      phone: email === 'reshmagujjuka4@gmail.com'
        ? '+91 98765 01234'
        : email === 'anjalikore775@gmail.com'
          ? '+91 98765 01235'
          : '+1 (555) 111-0001',
      passwordHash: await User.hashPassword(adminPasswordMap[email] || defaultPasswordHash),
      role: 'admin',
      profileImage: '',
      isActive: true,
      isEmailVerified: true
    })));

    const adminUser1 = adminUsers.find(user => user.email === 'reshmagujjuka4@gmail.com') || adminUsers[0];
    const adminUser2 = adminUsers.find(user => user.email === 'anjalikore775@gmail.com') || adminUsers[1] || adminUser1;
    const adminUser = adminUser1;

    const hospitalUser = await User.create({
      fullName: 'Dr. Robert Vance, MD',
      email: 'hospital@medifund.org',
      phone: '+1 (555) 482-1920',
      passwordHash: defaultPasswordHash,
      role: 'hospital',
      profileImage: '',
      organizationDetails: {
        orgName: 'Apollo Memorial Super Specialty Hospital',
        regNumber: 'HOSP-NY-89412',
        address: '450 Healthcare Boulevard, New York, NY 10016',
        contactPerson: 'Dr. Robert Vance'
      }
    });

    const ngoUser = await User.create({
      fullName: 'Elena Rostova (Director of Aid)',
      email: 'ngo@medifund.org',
      phone: '+1 (555) 732-9011',
      passwordHash: defaultPasswordHash,
      role: 'ngo',
      profileImage: '',
      organizationDetails: {
        orgName: 'Global Hope Healthcare Foundation',
        regNumber: 'NGO-FED-482910',
        address: '120 Humanitarian Way, Suite 400, Chicago, IL 60601',
        contactPerson: 'Elena Rostova'
      }
    });

    const donorUser = await User.create({
      fullName: 'David K. Miller',
      email: 'donor@medifund.org',
      phone: '+1 (555) 839-2041',
      passwordHash: defaultPasswordHash,
      role: 'donor',
      profileImage: ''
    });

    const patientUser = await User.create({
      fullName: 'Michael Zhang',
      email: 'patient@medifund.org',
      phone: '+1 (555) 349-1102',
      passwordHash: defaultPasswordHash,
      role: 'patient',
      profileImage: ''
    });

    console.log('[Seed] Created default users & authorized admin accounts.');

    // 2. Create Hospital Entities
    const hospital = await Hospital.create({
      userId: hospitalUser._id,
      hospitalName: 'Apollo Memorial Super Specialty Hospital',
      registrationNumber: 'HOSP-NY-89412',
      licenseNumber: 'MED-LIC-9901-US',
      address: '450 Healthcare Boulevard',
      city: 'New York',
      state: 'NY',
      contactEmail: 'verifications@apollomemorial.org',
      contactPhone: '+1 (555) 482-1920',
      departments: ['Cardiology', 'Oncology', 'Pediatrics', 'Neurology', 'Organ Transplant', 'Emergency'],
      verificationStatus: 'verified',
      bedCount: 450,
      doctorCount: 85,
      accreditation: 'JCI Accredited & American Heart Assoc. Recognized'
    });

    // 3. Create NGO Entities
    const ngo1 = await NGO.create({
      userId: ngoUser._id,
      ngoName: 'Global Hope Healthcare Foundation',
      registrationNumber: 'NGO-FED-482910',
      legalEntityType: 'Charitable Trust',
      yearOfEstablishment: 2016,
      website: 'https://globalhopehealth.org',
      mission: 'Providing transparent funding and critical surgical interventions for underserved families worldwide.',
      focusAreas: ['Pediatric Cardiology', 'Oncology Care', 'Emergency Surgery', 'Organ Transplant'],
      contactEmail: 'contact@globalhopehealth.org',
      contactPhone: '+1 (555) 732-9011',
      address: '120 Humanitarian Way, Chicago, IL',
      city: 'Chicago',
      state: 'IL',
      panNumber: 'AAATG8941K',
      tanNumber: 'CHCG09182F',
      regCertificateDoc: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      panCardDoc: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      addressProofDoc: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      repName: 'Elena Rostova',
      repDesignation: 'Executive Managing Trustee',
      repEmail: 'elena@globalhopehealth.org',
      repPhone: '+1 (555) 732-9011',
      verificationStatus: 'verified',
      trustScore: 95,
      trustBadge: 'Trusted NGO',
      totalFundPool: 175000,
      allocatedFunds: 58500,
      totalSponsoredPatients: 28,
      beneficiaryRatingsAverage: 4.95,
      ratingsCount: 48,
      surgeriesFunded: 22,
      icuDaysFunded: 94
    });

    const ngo2 = await NGO.create({
      userId: adminUser._id,
      ngoName: 'Little Hearts Pediatric Relief Fund',
      registrationNumber: 'NGO-FED-991204',
      legalEntityType: 'Registered Society',
      yearOfEstablishment: 2018,
      website: 'https://littleheartsfund.org',
      mission: 'Dedicated to sponsoring life-saving heart surgeries and neonatal treatments for children.',
      focusAreas: ['Pediatrics', 'Cardiology', 'Rare Diseases'],
      contactEmail: 'support@littleheartsfund.org',
      contactPhone: '+1 (555) 293-8472',
      address: '88 Childrens Plaza, Boston, MA',
      city: 'Boston',
      state: 'MA',
      panNumber: 'BBBTG9912L',
      tanNumber: 'BSTN01824G',
      verificationStatus: 'verified',
      trustScore: 91,
      trustBadge: 'Trusted NGO',
      totalFundPool: 120000,
      allocatedFunds: 42000,
      totalSponsoredPatients: 19,
      beneficiaryRatingsAverage: 4.9,
      ratingsCount: 32,
      surgeriesFunded: 16,
      icuDaysFunded: 68
    });

    // Create Initial Hospital Partnerships
    await HospitalPartnership.create([
      {
        ngoId: ngo1._id,
        hospitalId: hospital._id,
        partnershipType: 'Subsidized Surgery Tariff',
        specialties: ['Cardiology', 'Oncology', 'Pediatrics'],
        discountPercentage: 25,
        bedQuota: 6,
        status: 'active',
        responseNotes: 'Partnership ratified by Medical Directorate. Subsidized clinical tariff active.'
      },
      {
        ngoId: ngo2._id,
        hospitalId: hospital._id,
        partnershipType: 'Emergency ICU Bed Quota',
        specialties: ['Pediatrics', 'Neonatal Care'],
        discountPercentage: 20,
        bedQuota: 4,
        status: 'active',
        responseNotes: 'Pediatric cardiac emergency quota reserved.'
      }
    ]);

    // 4. Create Patient Profile
    const patientProfile = await Patient.create({
      userId: patientUser._id,
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Grace Zhang',
        relationship: 'Spouse',
        phone: '+1 (555) 349-1103'
      },
      medicalCondition: 'Severe Mitral Valve Prolapse & Congestive Heart Failure',
      primaryHospitalId: hospital._id,
      documents: [
        {
          title: 'Echocardiogram & Cardiac MRI Diagnostic Report',
          docType: 'Medical Report',
          fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          verificationStatus: 'verified'
        },
        {
          title: 'Hospital Surgery Cost Estimate & ICU Protocol',
          docType: 'Cost Estimate',
          fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          verificationStatus: 'verified'
        }
      ]
    });

    // 5. Create Campaigns
    const campaign1 = await Campaign.create({
      patientId: patientUser._id,
      patientName: 'Michael Zhang',
      patientAge: 34,
      patientGender: 'Male',
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      ngoId: ngo1._id,
      ngoName: ngo1.ngoName,
      title: 'Emergency Open-Heart Mitral Valve Surgery for Father of Two',
      category: 'Cardiology',
      description: 'Michael was diagnosed with critical mitral valve failure and urgently requires surgical valve replacement to prevent irreversible heart damage.',
      story: `Michael is a loving 34-year-old father of two young children aged 3 and 6. Three weeks ago, while playing in the yard with his daughter, he suddenly collapsed from severe oxygen deprivation. 

At the emergency center, doctors identified acute congestive heart failure caused by severe prolapse and tearing in his mitral valve. Without an immediate open-heart reconstruction surgery and post-operative ICU stabilization, the cardiologist warns of imminent life-threatening cardiac arrest.

The total cost estimate from Apollo Memorial Hospital is ₹10,00,000, which includes specialized cardiopulmonary bypass instrumentation, prosthetic valve grafting, and 6 days of intensive care. Michael works as an independent carpenter whose modest insurance does not cover the specialized valve prosthetics. Your generosity will bring this young father back to his children.`,
      fundingGoal: 1000000,
      raisedAmount: 650000,
      donorsCount: 142,
      status: 'approved',
      urgency: 'critical',
      bannerImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=medifund.michael@care&pn=MichaelZhang&cu=INR',
      medicalDocuments: [
        {
          name: 'Hospital Surgical Admission & Diagnostic Echo',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'Hospital Admission & Echo Report',
          verified: true,
          notes: 'Signed by Chief Cardiac Surgeon Dr. Robert Vance.'
        },
        {
          name: 'Itemized Operating Room & ICU Bill Estimate',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'Cost Estimate',
          verified: true,
          notes: 'Includes prosthetic valve and critical monitoring.'
        }
      ],
      verifiedByHospital: true,
      verifiedByNgo: true,
      hospitalReviewNotes: 'Patient clinical condition authenticated. Severe valve regurgitation documented on transesophageal echo. Operating theatre scheduled upon financial clearance.',
      ngoReviewNotes: 'Household financial assessment completed. Family qualifies for full humanitarian sponsorship under Global Hope standards.',
      hospitalEstimate: 1000000,
      treatmentStage: 'Surgery / Procedure',
      featured: true,
      fundsReleased: 400000
    });

    const campaign2 = await Campaign.create({
      patientId: adminUser._id,
      patientName: 'Emma Watson (Age 5)',
      patientAge: 5,
      patientGender: 'Female',
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      ngoId: ngo2._id,
      ngoName: ngo2.ngoName,
      title: 'Help 5-Year-Old Emma Beat Acute Lymphoblastic Leukemia',
      category: 'Oncology',
      description: 'Little Emma is bravely undergoing targeted chemotherapy cycles and bone marrow therapy for high-risk B-cell leukemia.',
      story: `Emma has always been full of laughter and dreams of becoming a veterinarian. Last month, persistent fever and unusual bruising led her pediatrician to conduct blood analyses, confirming Acute Lymphoblastic Leukemia (ALL).

She has commenced induction chemotherapy at Apollo Memorial Hospital pediatric cancer ward. Her treatment protocol requires 8 cycles of intensive chemotherapy, blood transfusions, and isolation ward care over the next 6 months.

Her mother took unpaid leave to stay by her bedside around the clock. Every rupee raised ensures Emma never misses a dose of life-saving immunotherapy and chemotherapy.`,
      fundingGoal: 1200000,
      raisedAmount: 840000,
      donorsCount: 210,
      status: 'approved',
      urgency: 'urgent',
      bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=medifund.emma@care&pn=EmmaWatson&cu=INR',
      medicalDocuments: [
        {
          name: 'Pediatric Oncology Biopsy Report',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'Oncology Histopathology',
          verified: true
        }
      ],
      verifiedByHospital: true,
      verifiedByNgo: true,
      hospitalReviewNotes: 'Pediatric oncology case verified. Protocol ALL-2024 initiated with positive initial cell reduction.',
      ngoReviewNotes: 'Little Hearts Foundation matched ₹2,00,000 in donor funds.',
      hospitalEstimate: 1200000,
      treatmentStage: 'Post-Op Recovery',
      featured: true,
      fundsReleased: 500000
    });

    const campaign3 = await Campaign.create({
      patientId: donorUser._id,
      patientName: 'Samuel Hernandez',
      patientAge: 47,
      patientGender: 'Male',
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      ngoId: ngo1._id,
      ngoName: ngo1.ngoName,
      title: 'Kidney Transplant & Immunosuppressive Therapy for Samuel',
      category: 'Organ Transplant',
      description: 'Stage 5 chronic kidney disease patient who found a matched living donor and needs surgical transplant funding.',
      story: `Samuel has battled end-stage renal disease with 3 weekly dialysis sessions for over four years. His brother was recently tested and confirmed as a 95% genetic match for living donation!

However, the cost of dual operating rooms for donor harvest and recipient grafting, followed by crucial post-transplant rejection prevention drugs, totals ₹8,00,000. 

Samuel has devoted his life to teaching middle school mathematics. Let us help this dedicated educator receive a new lease on life.`,
      fundingGoal: 800000,
      raisedAmount: 480000,
      donorsCount: 119,
      status: 'approved',
      urgency: 'normal',
      bannerImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=medifund.samuel@care&pn=SamuelHernandez&cu=INR',
      medicalDocuments: [
        {
          name: 'Living Donor HLA Crossmatch Clearance',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'Transplant Clearance Certificate',
          verified: true
        }
      ],
      verifiedByHospital: true,
      verifiedByNgo: true,
      hospitalReviewNotes: 'Transplant Ethics Committee verified donor consent and anatomical clearance.',
      ngoReviewNotes: 'Verified patient income criteria.',
      hospitalEstimate: 800000,
      treatmentStage: 'Treatment Plan & Tests',
      featured: true,
      fundsReleased: 200000
    });

    const campaign4 = await Campaign.create({
      patientId: patientUser._id,
      patientName: 'Aarav Patel (Age 8)',
      patientAge: 8,
      patientGender: 'Male',
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      ngoId: ngo2._id,
      ngoName: ngo2.ngoName,
      title: 'Corrective Spinal Scoliosis Surgery for Young Aarav',
      category: 'Orthopedics',
      description: 'Severe congenital 65-degree spinal curvature causing lung compression; requires growing rod spinal fusion.',
      story: `Aarav is an ambitious 8-year-old student whose congenital scoliosis has progressed rapidly to 65 degrees, beginning to pinch his ribcage against his developing lungs.

Pediatric orthopedic surgeons recommend magnetic expanding rod insertion to straighten his spine while allowing continued growth. Without this surgery, pulmonary complications could become irreversible within months.`,
      fundingGoal: 1000000,
      raisedAmount: 720000,
      donorsCount: 88,
      status: 'approved',
      urgency: 'urgent',
      bannerImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=medifund.aarav@care&pn=AaravPatel&cu=INR',
      medicalDocuments: [
        {
          name: 'Pediatric Spine Radiography and EOS 3D Scan',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'Radiology Scan',
          verified: true
        }
      ],
      verifiedByHospital: true,
      verifiedByNgo: true,
      hospitalReviewNotes: 'Surgical plan verified by Pediatric Orthopedics Chair.',
      ngoReviewNotes: 'Grant approved for partial coverage.',
      hospitalEstimate: 1000000,
      treatmentStage: 'Diagnosis & Admission',
      featured: false,
      fundsReleased: 300000
    });

    const campaign5 = await Campaign.create({
      patientId: patientUser._id,
      patientName: 'Sophia Lee',
      patientAge: 29,
      patientGender: 'Female',
      hospitalId: hospital._id,
      hospitalName: hospital.hospitalName,
      ngoId: ngo1._id,
      ngoName: ngo1.ngoName,
      title: 'Urgent Craniotomy & Brain Tumor Resection for Sophia',
      category: 'Neurology',
      description: '29-year-old graphic artist diagnosed with progressive vestibular schwannoma requiring microsurgical neurosurgery.',
      story: `Sophia was diagnosed with a rapidly growing intracranial tumor pressing against her brainstem. Experienced neurosurgeons at Apollo Memorial have prepared a specialized skull-base microsurgery with intraoperative nerve monitoring.`,
      fundingGoal: 1500000,
      raisedAmount: 1500000,
      donorsCount: 165,
      status: 'completed',
      urgency: 'critical',
      bannerImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=medifund.sophia@care&pn=SophiaLee&cu=INR',
      medicalDocuments: [
        {
          name: 'Neurological Contrast MRI & Pathology',
          url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
          docType: 'MRI Neuro Scan',
          verified: true
        }
      ],
      verifiedByHospital: true,
      verifiedByNgo: true,
      hospitalReviewNotes: 'Neurosurgery completed with 98% tumor resection. Patient showing remarkable motor recovery.',
      ngoReviewNotes: '100% target attained. Complete settlement released.',
      hospitalEstimate: 1500000,
      treatmentStage: 'Discharged & Follow-up',
      featured: false,
      fundsReleased: 1500000
    });

    // 6. Create Seed Donations
    const donation1 = await Donation.create({
      donorId: donorUser._id,
      donorName: donorUser.fullName,
      donorEmail: donorUser.email,
      donorPhone: donorUser.phone || '+91 98765 43210',
      campaignId: campaign1._id,
      amount: 5000,
      tipAmount: 250,
      paymentProvider: 'Razorpay',
      paymentMethod: 'UPI (Google Pay)',
      transactionId: 'TXN-RZP-9812401',
      receiptNumber: 'MEDIRCP-2026-891023',
      transactionStatus: 'completed',
      message: 'Praying for Michael and his family. Stay strong!',
      taxDeductible: true
    });

    const donation2 = await Donation.create({
      donorId: donorUser._id,
      donorName: donorUser.fullName,
      donorEmail: donorUser.email,
      donorPhone: donorUser.phone || '+91 98765 43210',
      campaignId: campaign2._id,
      amount: 10000,
      tipAmount: 500,
      paymentProvider: 'Razorpay',
      paymentMethod: 'UPI (PhonePe)',
      transactionId: 'TXN-RZP-9812402',
      receiptNumber: 'MEDIRCP-2026-891024',
      transactionStatus: 'completed',
      message: 'Emma, you are a warrior! Sending lots of love from our family.',
      taxDeductible: true
    });

    const donation3 = await Donation.create({
      donorId: adminUser._id,
      donorName: 'Anonymous Champion',
      donorEmail: 'benefactor@medifund.org',
      donorPhone: '+91 99887 76655',
      campaignId: campaign1._id,
      amount: 25000,
      tipAmount: 1000,
      paymentProvider: 'Razorpay',
      paymentMethod: 'Net Banking (HDFC Bank)',
      transactionId: 'TXN-RZP-9812403',
      receiptNumber: 'MEDIRCP-2026-891025',
      transactionStatus: 'completed',
      isAnonymous: true,
      message: 'Dedicated to supporting cardiac patient recovery.',
      taxDeductible: true
    });

    // 7. Create Clinical Treatment Updates
    await TreatmentUpdate.create({
      campaignId: campaign1._id,
      updatedBy: hospitalUser._id,
      authorName: 'Dr. Robert Vance (Chief Surgeon)',
      authorRole: 'hospital',
      title: 'Successful Open-Heart Valve Replacement Completed',
      description: 'Patient Michael Zhang underwent a 5-hour cardiopulmonary bypass procedure today. The prosthetic bileaflet heart valve was seated with zero perioperative complications. Cardiac sinus rhythm was restored seamlessly.',
      stage: 'Surgery / Procedure',
      mediaUrls: [
        'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80'
      ],
      doctorNotes: 'Vital signs stable. Extubated after 14 hours in the Cardiac Intensive Care Unit (CICU). Inotropic support being weaned.',
      recoveryPercentage: 65
    });

    await TreatmentUpdate.create({
      campaignId: campaign2._id,
      updatedBy: hospitalUser._id,
      authorName: 'Dr. Anita Roy (Pediatric Oncologist)',
      authorRole: 'hospital',
      title: 'Cycle 3 Chemotherapy Completed - Marrow Clearance at 92%',
      description: 'Emma responded exceptionally well to the latest cycle. Bone marrow aspirate shows blast cell counts dropped below 1%, entering early molecular remission.',
      stage: 'Post-Op Recovery',
      doctorNotes: 'Platelet counts recovering. Emma is smiling and asking for her coloring books in the pediatric daycare ward.',
      recoveryPercentage: 75
    });

    // 8. Create Fund Allocation
    await FundAllocation.create({
      ngoId: ngo1._id,
      campaignId: campaign1._id,
      hospitalId: hospital._id,
      amount: 15000,
      purpose: 'Cardiac Surgery OR Equipment & Valve Implant Settlement',
      billInvoiceNumber: 'INV-APOLLO-98412',
      billDocumentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      status: 'released',
      releaseDate: new Date(),
      notes: 'Direct wire cleared to Apollo Memorial billing department.'
    });

    // 9. Create Case Transfer Record
    await CaseTransfer.create({
      campaignId: campaign4._id,
      fromNgoId: ngo1._id,
      toNgoId: ngo2._id,
      reason: 'Specialized pediatric orthopedics matching through Little Hearts Pediatric Relief program',
      amountNeeded: 12000,
      status: 'accepted',
      notes: 'Transfer accepted to cover implant costs with targeted donor matching.'
    });

    // 10. Create Notifications
    await Notification.create({
      recipientId: patientUser._id,
      type: 'donation_received',
      title: 'New Donation of $500 Received',
      message: 'David K. Miller donated $500 toward your surgery campaign. "Praying for Michael and his family!"',
      link: `/campaigns/${campaign1._id}`
    });

    await Notification.create({
      recipientId: hospitalUser._id,
      type: 'verification_status',
      title: 'New Medical Verification Request',
      message: 'Aarav Patel has submitted medical records for pediatric spinal scoliosis review.',
      link: `/hospital/verifications`
    });

    await Notification.create({
      recipientId: donorUser._id,
      type: 'campaign_update',
      title: 'Clinical Milestone on Michael Zhang Case',
      message: 'Dr. Robert Vance posted a new surgical update: "Successful Open-Heart Valve Replacement Completed".',
      link: `/campaigns/${campaign1._id}`
    });

    // 11. Create Audit Logs
    await AuditLog.create({
      actorId: adminUser._id,
      actorName: adminUser.fullName,
      actorRole: 'admin',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'ROOT',
      details: { environment: 'production-ready', seedTimestamp: new Date().toISOString() }
    });

    await AuditLog.create({
      actorId: hospitalUser._id,
      actorName: hospitalUser.fullName,
      actorRole: 'hospital',
      action: 'CAMPAIGN_VERIFIED',
      entityType: 'Campaign',
      entityId: campaign1._id.toString(),
      details: { title: campaign1.title, verifiedStatus: true }
    });

    console.log('[Seed] Database seeded successfully with realistic live records!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
