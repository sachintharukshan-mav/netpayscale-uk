import pseoData from "@/data/pseo_cities_roles.json";
import nhsData from "@/data/nhs_afc_2026.json";

export interface PseoEntry {
  slug: string;
  band: string;
  roleName: string;
  roleSlug: string;
  regionId: string;
  regionName: string;
  regionHeadline: string;
  step: string;
  hcasZone: "inner-london" | "outer-london" | "fringe" | "standard";
  description: string;
}

export interface RoleHubMetadata {
  category:
    | "Nursing & Midwifery"
    | "Paramedics & Emergency Care"
    | "Allied Health Professionals (AHPs)"
    | "Pharmacy & Advanced Clinical Practice"
    | "Clinical Support & Phlebotomy"
    | "Psychology, Healthcare Science & Leadership";
  registrationBody: string;
  typicalQualification: string;
  previousRoleSlug?: string;
  nextRoleSlug?: string;
  clinicalSummary: string;
  progressionSummary: string;
}

export interface RoleHubEntry extends RoleHubMetadata {
  roleSlug: string;
  roleName: string;
  band: string;
  bandSlug: string;
  regionalSpokes: PseoEntry[];
}

const BAND_ORDER = [
  "Band 2",
  "Band 3",
  "Band 4",
  "Band 5",
  "Band 6",
  "Band 7",
  "Band 8a",
  "Band 8b",
  "Band 8c",
  "Band 8d",
  "Band 9",
];

const ROLE_METADATA: Record<string, RoleHubMetadata> = {
  // Band 2
  "healthcare-assistant": {
    category: "Clinical Support & Phlebotomy",
    registrationBody: "NHS Care Certificate (Trust Statutory Standards)",
    typicalQualification: "Care Certificate, GCSEs (or equivalent) & Level 2 Diploma in Care",
    nextRoleSlug: "senior-healthcare-assistant",
    clinicalSummary:
      "Healthcare Assistants (HCAs) form the frontline backbone of NHS inpatient wards, emergency departments, and community clinics, delivering personal care, physiological observations, and direct patient support under Registered Nurse supervision.",
    progressionSummary:
      "Under the 2026/27 Agenda for Change structure, Band 2 is a single spot-rate spine point. HCAs Who take on delegated clinical competencies (cannulation, ECGs, venepuncture, catheter care) are eligible for re-banding or promotion to Band 3 Senior Healthcare Assistant.",
  },
  "clinical-support-worker": {
    category: "Clinical Support & Phlebotomy",
    registrationBody: "NHS Care Certificate (Trust Statutory Standards)",
    typicalQualification: "Care Certificate & NHS Acute/Community Induction",
    nextRoleSlug: "senior-healthcare-assistant",
    clinicalSummary:
      "Clinical Support Workers (CSWs) work alongside multi-disciplinary nursing and allied health teams in acute hospitals, theatres, and outpatient clinics to prepare clinical environments, assist with patient mobility, and record baseline observations.",
    progressionSummary:
      "Band 2 CSWs receive a single consolidated Agenda for Change spot salary plus enhanced Section 2 unsocial hours (+44% nights/Saturdays, +88% Sundays/Bank Holidays). Progression leads to Band 3 Senior Support Worker or Band 4 Assistant Practitioner.",
  },
  phlebotomist: {
    category: "Clinical Support & Phlebotomy",
    registrationBody: "NHS Trust Venepuncture Competency Accreditation",
    typicalQualification: "Level 2/3 Certificate in Phlebotomy & Care Certificate",
    nextRoleSlug: "senior-healthcare-assistant",
    clinicalSummary:
      "NHS Phlebotomists perform routine and specialist venepuncture across hospital outpatient blood clinics, inpatient wards, GP hubs, and domiciliary community visits, ensuring strict specimen labelling and infection control compliance.",
    progressionSummary:
      "Entry-level Phlebotomists are banded at Band 2 on a single national spot salary. Team leads, paediatric specialist phlebotomists, and trainers typically progress to Band 3 or Band 4 pathology support roles.",
  },

  // Band 3
  "senior-healthcare-assistant": {
    category: "Clinical Support & Phlebotomy",
    registrationBody: "NHS Care Certificate & Level 3 Clinical Competencies",
    typicalQualification: "Level 3 Diploma in Healthcare Support or Equivalent Ward Experience",
    previousRoleSlug: "healthcare-assistant",
    nextRoleSlug: "nursing-associate",
    clinicalSummary:
      "Senior Healthcare Assistants at Band 3 undertake delegated clinical tasks including venepuncture, cannulation, 12-lead ECG recording, complex wound dressings, and mentoring newly appointed Band 2 support staff.",
    progressionSummary:
      "Band 3 includes an entry point and a top step reached after 2 years of reckonable NHS service. Many Band 3 Senior HCAs progress onto the funded 2-year Trainee Nursing Associate (TNA) apprenticeship to qualify at Band 4.",
  },
  "emergency-care-assistant": {
    category: "Paramedics & Emergency Care",
    registrationBody: "NHS Ambulance Trust Driving & Clinical Governance",
    typicalQualification: "FREC 3/4 or AAP Qualification & CERAD Blue-Light Driving Certificate",
    previousRoleSlug: "clinical-support-worker",
    nextRoleSlug: "paramedic",
    clinicalSummary:
      "Emergency Care Assistants (ECAs) respond to 999 emergencies alongside Qualified Paramedics, operating blue-light emergency ambulances, assisting with pre-hospital trauma care, airway management, and resuscitation.",
    progressionSummary:
      "ECAs start at Band 3 Entry and step up to the Band 3 top spine point after 2 years. Because ambulance shifts span 24/7 rotas, ECAs benefit from Band 3 Section 2 unsocial hours (+44% nights/Saturdays, +88% Sundays) or Section 2 Annex 5 arrangements, and can progress via internal degree apprenticeships to Band 5 Paramedic.",
  },
  "pharmacy-assistant": {
    category: "Pharmacy & Advanced Clinical Practice",
    registrationBody: "General Pharmaceutical Council (GPhC) Support Staff Training",
    typicalQualification: "NVQ Level 2 Certificate in Pharmacy Service Skills (GPhC Accredited)",
    previousRoleSlug: "clinical-support-worker",
    nextRoleSlug: "pharmacy-technician",
    clinicalSummary:
      "NHS Hospital Pharmacy Assistants manage inpatient ward stock top-ups, automated robotic dispensing systems, controlled drug receipt logs, and outpatient prescription assembly within acute hospital dispensaries.",
    progressionSummary:
      "Band 3 Pharmacy Assistants progress to the top of Band 3 after 2 years of service and frequently undertake the funded 2-year Pre-Registration Trainee Pharmacy Technician (PTPT) pathway to register as a Band 4 Pharmacy Technician.",
  },

  // Band 4
  "nursing-associate": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Foundation Degree (FdSc) as a Registered Nursing Associate & Active NMC PIN",
    previousRoleSlug: "senior-healthcare-assistant",
    nextRoleSlug: "nurse",
    clinicalSummary:
      "Registered Nursing Associates (RNAs) bridge the clinical gap between Healthcare Support Workers and Registered Nurses, holding their own NMC registration to administer medications, perform clinical assessments, and deliver care across acute, mental health, and community settings.",
    progressionSummary:
      "Band 4 RNAs progress from Entry to the Top step after 3 years of service. Registered Nursing Associates can complete an 18-to-24-month NMC accredited top-up degree apprenticeship to qualify as a Band 5 Registered Nurse.",
  },
  "assistant-practitioner": {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "NHS Trust Clinical Governance & AHP Competency Framework",
    typicalQualification: "Foundation Degree (FdSc) in Health and Social Care or Higher Apprenticeship",
    previousRoleSlug: "senior-healthcare-assistant",
    nextRoleSlug: "physiotherapist",
    clinicalSummary:
      "Assistant Practitioners (APs) work at a higher level of clinical autonomy than traditional support workers across physiotherapy, diagnostic radiography, occupational therapy, speech therapy, and acute rehabilitation units.",
    progressionSummary:
      "Band 4 APs reach the top of Band 4 after 3 years of completed service and can transition onto accelerated BSc degree apprenticeships to gain HCPC registration as a Band 5 Allied Health Professional.",
  },
  "pharmacy-technician": {
    category: "Pharmacy & Advanced Clinical Practice",
    registrationBody: "GPhC (General Pharmaceutical Council)",
    typicalQualification: "Level 3 Diploma in Principles and Practice for Pharmacy Technicians & GPhC Registration",
    previousRoleSlug: "pharmacy-assistant",
    nextRoleSlug: "pharmacist",
    clinicalSummary:
      "Registered NHS Pharmacy Technicians perform medicines reconciliation on hospital admissions, final accuracy checking (ACT), aseptic chemotherapy preparation, and patient counselling on discharge medications.",
    progressionSummary:
      "Newly registered Pharmacy Technicians start at Band 4 Entry and reach the top step at 3 years. With Accredited Checking Technician (ACT) and medicines management qualifications, many progress into Band 5 Senior and Band 6 Lead Pharmacy Technician roles.",
  },

  // Band 5
  nurse: {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "BSc (Hons) / MSc Nursing & Active NMC Registration (RN)",
    previousRoleSlug: "nursing-associate",
    nextRoleSlug: "sister-charge-nurse",
    clinicalSummary:
      "Band 5 Staff Nurses (Registered Nurses - Adult, Children's, Mental Health, and Learning Disability) represent the largest single clinical profession in the NHS, assessing, planning, and delivering acute, emergency, surgical, and community nursing care.",
    progressionSummary:
      "Band 5 Staff Nurses start at the Entry spine point, advance to the Mid-point after 2 years, and reach the Top step after 4 years of service. Rotational ward nurses earn +30% on weekday nights/Saturdays and +60% on Sundays/Bank Holidays before progressing to Band 6 Junior Sister / Charge Nurse.",
  },
  paramedic: {
    category: "Paramedics & Emergency Care",
    registrationBody: "HCPC (Health and Care Professions Council)",
    typicalQualification: "BSc (Hons) Paramedic Science & HCPC Registration",
    previousRoleSlug: "emergency-care-assistant",
    nextRoleSlug: "senior-paramedic",
    clinicalSummary:
      "Newly Qualified Paramedics (NQPs) respond autonomously to life-threatening 999 calls across NHS Ambulance Trusts, performing advanced life support, ECG interpretation, intravenous drug administration, and pre-hospital triage.",
    progressionSummary:
      "NQPs enter at Band 5 during their 24-month structured preceptorship portfolio. Upon completing their NQP consolidation period (typically 2 years), Paramedics automatically transition onto Band 6 Paramedic / Senior Paramedic pay scales.",
  },
  physiotherapist: {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "HCPC (Health and Care Professions Council) & CSP",
    typicalQualification: "BSc (Hons) / MSc Physiotherapy & HCPC Registration",
    previousRoleSlug: "assistant-practitioner",
    nextRoleSlug: "specialist-physiotherapist",
    clinicalSummary:
      "Band 5 NHS Physiotherapists complete structured clinical rotations (typically 4 to 6 months each) across musculoskeletal outpatients, respiratory ICU/ITU, neuro-rehabilitation, orthopaedics, and care of the elderly.",
    progressionSummary:
      "Band 5 Physiotherapists progress to the Mid-point at 2 years and Top step at 4 years, though most transition into Band 6 Specialist Physiotherapist posts after 18 to 24 months of rotational experience.",
  },
  radiographer: {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "HCPC (Health and Care Professions Council) & SoR",
    typicalQualification: "BSc (Hons) Diagnostic or Therapeutic Radiography & HCPC Registration",
    previousRoleSlug: "assistant-practitioner",
    nextRoleSlug: "specialist-radiographer",
    clinicalSummary:
      "Band 5 Diagnostic and Therapeutic Radiographers deliver plain-film X-ray imaging, trauma emergency diagnostics, mobile theatre fluoroscopy, CT/MRI scanning, and oncology radiation therapy across NHS acute hospitals.",
    progressionSummary:
      "Band 5 Radiographers advance through the 2-year and 4-year spine steps, earning Section 2 unsocial hours enhancements for 24/7 emergency and on-call rotas, and progress to Band 6 Specialist Radiographer (CT, MRI, Ultrasound, or Interventional).",
  },
  "occupational-therapist": {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "HCPC (Health and Care Professions Council) & RCOT",
    typicalQualification: "BSc (Hons) / MSc Occupational Therapy & HCPC Registration",
    previousRoleSlug: "assistant-practitioner",
    nextRoleSlug: "specialist-physiotherapist",
    clinicalSummary:
      "Band 5 Occupational Therapists (OTs) assess functional independence, cognitive rehabilitation, home adaptation requirements, and safe hospital discharge pathways across physical health, mental health, and community teams.",
    progressionSummary:
      "Band 5 OTs complete rotational preceptorships across acute and community specialties, advancing at 2 and 4 years or moving into Band 6 Senior / Specialist Occupational Therapist roles.",
  },
  midwife: {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "BSc (Hons) / MSc Midwifery & Active NMC Registration (RM)",
    previousRoleSlug: "nursing-associate",
    nextRoleSlug: "specialist-midwife",
    clinicalSummary:
      "Newly Qualified Midwives enter the NHS at Band 5 during their preceptorship year, providing antenatal care, intrapartum labour ward delivery support, and postnatal care for mothers and newborns.",
    progressionSummary:
      "Under NHS Annex 20 career progression rules, newly qualified Band 5 Midwives complete a structured 12-to-18-month preceptorship framework and progress directly into Band 6 Rotational / Community Midwife roles upon competency sign-off.",
  },

  // Band 6
  "sister-charge-nurse": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse (NMC PIN) + Post-Registration Ward Leadership / Specialty Modules",
    previousRoleSlug: "nurse",
    nextRoleSlug: "ward-manager",
    clinicalSummary:
      "Band 6 Junior Sisters, Charge Nurses, and Clinical Nurse Specialists (CNS) lead shift-by-shift clinical operations on acute hospital wards, coordinate emergency patient flow, mentor Band 5 nurses, and run specialist outpatient clinics.",
    progressionSummary:
      "Band 6 spans three spine points: Entry (0 yrs), Intermediate (2 yrs), and Top Step (5+ yrs). Stepping from Band 5 Top to Band 6 Entry gives a modest initial increase before unlocking significant pay growth at the 2-year and 5-year increments.",
  },
  "senior-paramedic": {
    category: "Paramedics & Emergency Care",
    registrationBody: "HCPC (Health and Care Professions Council)",
    typicalQualification: "HCPC Registered Paramedic + Completed 2-Year NQP Portfolio / Mentorship",
    previousRoleSlug: "paramedic",
    nextRoleSlug: "advanced-paramedic",
    clinicalSummary:
      "Band 6 Experienced Paramedics and Senior Paramedic Team Leaders act as the senior clinical decision-makers at complex pre-hospital incidents, supervise NQPs and ECAs, and manage solo rapid-response vehicles (RRVs).",
    progressionSummary:
      "Band 6 Paramedics progress after 2 years to the intermediate step and after 5 years to the top step, with further progression to Band 7 Advanced Paramedic Practitioner (APP) or Clinical Operations Manager.",
  },
  "specialist-physiotherapist": {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "HCPC (Health and Care Professions Council)",
    typicalQualification: "HCPC Registered Physiotherapist + Completed Band 5 Core Rotations",
    previousRoleSlug: "physiotherapist",
    nextRoleSlug: "acp",
    clinicalSummary:
      "Band 6 Specialist Physiotherapists hold autonomous clinical caseloads within a dedicated specialty such as MSK outpatients, critical care respiratory on-call, stroke neuro-rehabilitation, paediatrics, or pelvic health.",
    progressionSummary:
      "Band 6 Specialist Physiotherapists advance to the mid-point after 2 years and top step after 5 years, subsequently progressing to Band 7 Team Lead / Highly Specialist Physiotherapist or First Contact Practitioner (FCP).",
  },
  "specialist-radiographer": {
    category: "Allied Health Professionals (AHPs)",
    registrationBody: "HCPC (Health and Care Professions Council)",
    typicalQualification: "HCPC Registered Radiographer + Cross-Sectional CT/MRI or Interventional Training",
    previousRoleSlug: "radiographer",
    nextRoleSlug: "acp",
    clinicalSummary:
      "Band 6 Specialist Radiographers lead complex diagnostic imaging modalities including multi-slice CT trauma scanning, MRI sequences, interventional cardiology/angiography suites, and senior radiotherapy planning.",
    progressionSummary:
      "Band 6 Radiographers progress at 2 and 5 years of service and frequently undertake postgraduate PG Cert/Diploma reporting qualifications to move into Band 7 Reporting Radiographer or Modality Superintendent roles.",
  },
  "specialist-midwife": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Midwife (NMC PIN) + Completed Preceptorship / Specialty Portfolio",
    previousRoleSlug: "midwife",
    nextRoleSlug: "ward-manager",
    clinicalSummary:
      "Band 6 Rotational and Specialist Midwives form the core autonomous midwifery workforce across NHS delivery suites, birth centres, antenatal triage, fetal medicine, safeguarding, and bereavement care.",
    progressionSummary:
      "Following preceptorship at Band 5, Midwives spend their main clinical career at Band 6 (progressing at 2 and 5 years) before stepping up to Band 7 Delivery Suite Coordinator, Community Team Leader, or Specialist Lead Midwife.",
  },

  // Band 7
  "ward-manager": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + Substantial Band 6 Leadership & Management Experience",
    previousRoleSlug: "sister-charge-nurse",
    nextRoleSlug: "matron",
    clinicalSummary:
      "Band 7 Ward Managers, Senior Sisters, and Delivery Suite Coordinators hold 24-hour operational, budgetary, rostering, and patient safety accountability for an entire NHS inpatient ward or clinical department.",
    progressionSummary:
      "Band 7 has three spine steps: Entry (0 yrs), Intermediate (2 yrs), and Top Step (5+ yrs). Ward Managers typically progress to Band 8a Modern Matron or Clinical Service Manager.",
  },
  acp: {
    category: "Pharmacy & Advanced Clinical Practice",
    registrationBody: "NMC / HCPC / GPhC (Multi-Professional ACP Credential)",
    typicalQualification: "MSc in Advanced Clinical Practice + Independent Prescribing (V300)",
    previousRoleSlug: "sister-charge-nurse",
    nextRoleSlug: "nurse-consultant",
    clinicalSummary:
      "Trainee and Newly Credentialed Advanced Clinical Practitioners (ACPs) from nursing, paramedic, pharmacy, or AHP backgrounds work on medical tier rotas—taking clinical histories, ordering diagnostics, performing invasive procedures, and prescribing independently.",
    progressionSummary:
      "Trainee ACPs are frequently remunerated at Band 7 while completing their MSc across the four pillars of advanced practice, progressing to the Band 7 Top Step or Band 8a Lead / Credentialed ACP upon completion.",
  },
  "advanced-paramedic": {
    category: "Paramedics & Emergency Care",
    registrationBody: "HCPC (Health and Care Professions Council)",
    typicalQualification: "MSc / PGDip Advanced Paramedic Practice + Independent Prescribing",
    previousRoleSlug: "senior-paramedic",
    nextRoleSlug: "nurse-consultant",
    clinicalSummary:
      "Band 7 Advanced Paramedic Practitioners (APPs) in Critical Care (HEMS/Air Ambulance, Hazardous Area Response Teams) or Urgent & Primary Care manage either high-acuity pre-hospital trauma/resuscitation or autonomous community admission avoidance.",
    progressionSummary:
      "Band 7 APPs progress through the 2-year and 5-year spine points and can advance into Band 8a Consultant Paramedic or Head of Clinical Operations posts.",
  },
  pharmacist: {
    category: "Pharmacy & Advanced Clinical Practice",
    registrationBody: "GPhC (General Pharmaceutical Council)",
    typicalQualification: "MPharm Degree + GPhC Registration + Postgraduate Clinical Pharmacy Diploma / IP",
    previousRoleSlug: "pharmacy-technician",
    nextRoleSlug: "chief-pharmacist",
    clinicalSummary:
      "Band 7 Rotational and Specialist Clinical Pharmacists lead ward-based medicines optimisation, antimicrobial stewardship, critical care parenteral nutrition, oncology verification, and independent prescribing across NHS Hospital Trusts.",
    progressionSummary:
      "While Newly Qualified Foundation Pharmacists start at Band 6, Pharmacists rapidly progress to Band 7 Specialist Pharmacist (stepping up at 2 and 5 years) and subsequently to Band 8a/8b Principal Pharmacist and Band 8d/9 Chief Pharmacist.",
  },
  "clinical-manager": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "NMC / HCPC / NHS Operational Management Framework",
    typicalQualification: "Degree-Level Clinical Registration or NHS Graduate Management Training Scheme (GMTS)",
    previousRoleSlug: "sister-charge-nurse",
    nextRoleSlug: "service-manager",
    clinicalSummary:
      "Band 7 Clinical Team Leaders and Service Delivery Managers oversee multi-disciplinary community teams, diagnostic modalities, or surgical theatre suites, managing 18-week RTT waiting list targets, governance, and staffing budgets.",
    progressionSummary:
      "Band 7 Clinical Managers advance at 2 and 5 years of service and step up to Band 8a Operational Service Manager or Clinical Matron.",
  },

  // Band 8a
  matron: {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + Postgraduate Leadership Qualification & Band 7 Ward Management",
    previousRoleSlug: "ward-manager",
    nextRoleSlug: "senior-matron",
    clinicalSummary:
      "Band 8a Modern Matrons oversee a group of inpatient wards or an entire clinical directorate (such as Emergency Medicine, Surgery, or Maternity), driving infection prevention, CQC quality compliance, workforce retention, and patient experience.",
    progressionSummary:
      "Under the 2026/27 Agenda for Change structure, Band 8a features an Entry point and a Top step reached after 5 years of service, with career progression to Band 8b Senior Matron or Band 8c Head of Nursing.",
  },
  "nurse-consultant": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "MSc / Doctorate in Clinical Specialty + Independent Prescribing + Advanced Practice Portfolio",
    previousRoleSlug: "acp",
    nextRoleSlug: "senior-matron",
    clinicalSummary:
      "Band 8a Advanced Nurse Practitioners and Associate Nurse Consultants lead autonomous nurse-led services, complex diagnostic clinics, and clinical research across oncology, cardiology, emergency care, and mental health.",
    progressionSummary:
      "Band 8a reaches its top spine step after 5 years of service. Full Consultant Nurses and Multi-Professional Consultant Practitioners progress to Band 8b and Band 8c.",
  },
  psychologist: {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "HCPC (Health and Care Professions Council) & BPS",
    typicalQualification: "Doctorate in Clinical Psychology (DClinPsy) & HCPC Practitioner Psychologist Registration",
    previousRoleSlug: "clinical-manager",
    nextRoleSlug: "consultant-psychologist",
    clinicalSummary:
      "Band 8a Principal Clinical Psychologists deliver highly specialist psychological formulation, trauma therapy, neuropsychological assessment, and clinical supervision across NHS CAMHS, adult mental health, and acute health psychology services.",
    progressionSummary:
      "Trainee Clinical Psychologists start at Band 6, qualify into Band 7 Clinical Psychologist posts, and progress to Band 8a Principal Psychologist (reaching the Band 8a top step at 5 years) before Band 8b/8c Consultant Clinical Psychologist.",
  },
  "service-manager": {
    category: "Psychology, Healthcare Science & Leadership",
    typicalQualification: "MSc Healthcare Management / NHS GMTS or Substantial Band 7 Operational Experience",
    registrationBody: "NHS Operational & Commissioning Leadership Standards",
    previousRoleSlug: "clinical-manager",
    nextRoleSlug: "head-of-service",
    clinicalSummary:
      "Band 8a Operational Service Managers hold P&L budget accountability, cancer and elective recovery performance targets, and multi-million-pound capacity planning across clinical divisions within NHS Hospital Trusts.",
    progressionSummary:
      "Band 8a Service Managers reach their top pay step after 5 years of service and progress to Band 8b General Manager / Head of Service.",
  },

  // Band 8b
  "senior-matron": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + MSc Healthcare Leadership & Band 8a Matron Experience",
    previousRoleSlug: "matron",
    nextRoleSlug: "head-of-nursing",
    clinicalSummary:
      "Band 8b Senior Matrons and Lead Nurses direct nursing workforce strategy, safe staffing establishment reviews, and clinical governance across large multi-site hospital divisions.",
    progressionSummary:
      "Band 8b spans Entry (0 yrs) to Top Step (5+ yrs). Crossing £65,191 triggers the top 12.5% NHS CARE Pension contribution tier, and prepares leaders for Band 8c Head of Nursing.",
  },
  "consultant-psychologist": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "HCPC (Health and Care Professions Council) & BPS",
    typicalQualification: "Doctorate in Clinical Psychology (DClinPsy) + Extensive Post-Doctoral Leadership",
    previousRoleSlug: "psychologist",
    nextRoleSlug: "consultant-scientist",
    clinicalSummary:
      "Band 8b Consultant Clinical Psychologists serve as clinical leads for psychological therapies across NHS Mental Health Trusts, directing complex care pathways, service governance, and doctoral supervision.",
    progressionSummary:
      "Band 8b Consultant Psychologists reach the top step after 5 years of service and can advance to Band 8c/8d Professional Lead or Trust Director of Psychological Therapies.",
  },
  "head-of-service": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "NHS Senior Operational Management & HCPC/NMC",
    typicalQualification: "Postgraduate Leadership Qualification + Senior Divisional Management Track Record",
    previousRoleSlug: "service-manager",
    nextRoleSlug: "associate-director",
    clinicalSummary:
      "Band 8b Heads of Clinical Services and Divisional General Managers lead multi-specialty hospital directorates, controlling clinical capital programmes, consultant job planning, and Trust-wide service transformation.",
    progressionSummary:
      "Band 8b reaches its top pay step after 5 years of reckonable service, leading directly to Band 8c Associate Director of Operations.",
  },

  // Band 8c
  "head-of-nursing": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + Master's Degree & Senior Divisional Leadership",
    previousRoleSlug: "senior-matron",
    nextRoleSlug: "deputy-director-nursing",
    clinicalSummary:
      "Band 8c Divisional Heads of Nursing and Midwifery hold professional and operational accountability for hundreds of nursing staff across a major clinical group (such as Unscheduled Care, Surgery, or Women & Children's Services).",
    progressionSummary:
      "Band 8c progresses from Entry to Top Step after 5 years of service, serving as the primary stepping stone to Band 8d Deputy Chief Nurse / Deputy Director of Nursing.",
  },
  "associate-director": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "NHS Executive & Senior Operational Leadership Framework",
    typicalQualification: "Master's / MBA in Healthcare Administration & Senior NHS Directorate Leadership",
    previousRoleSlug: "head-of-service",
    nextRoleSlug: "director-of-operations",
    clinicalSummary:
      "Band 8c Associate Directors of Operations and Strategy lead hospital-wide operational performance, Integrated Care System (ICS) commissioning interfaces, and major clinical reconfiguration programmes.",
    progressionSummary:
      "Band 8c spans Entry to Top Step (5+ years), with progression to Band 8d Director of Operations or Divisional Managing Director.",
  },
  "consultant-scientist": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "HCPC & Academy for Healthcare Science (AHCS Higher Specialist Scientist Register)",
    typicalQualification: "FRCPath / Higher Specialist Scientist Training (HSST Doctorate) & HCPC Registration",
    previousRoleSlug: "consultant-psychologist",
    nextRoleSlug: "clinical-director",
    clinicalSummary:
      "Band 8c Consultant Clinical Scientists head NHS pathology, clinical biochemistry, genomics, medical physics, and bioinformatics departments, providing consultant-level diagnostic interpretation and scientific direction.",
    progressionSummary:
      "Band 8c Consultant Clinical Scientists progress to the top step at 5 years and can advance to Band 8d and Band 9 Scientific Director posts.",
  },

  // Band 8d
  "deputy-director-nursing": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + Executive Master's & Trust-Wide Leadership",
    previousRoleSlug: "head-of-nursing",
    nextRoleSlug: "director-of-nursing",
    clinicalSummary:
      "Band 8d Deputy Directors of Nursing (Deputy Chief Nurses) deputise for the Executive Chief Nurse across the entire NHS Trust, leading statutory patient safety, CQC regulatory readiness, and nursing workforce strategy.",
    progressionSummary:
      "At Band 8d, gross salaries exceed £94,826/yr at entry and £99,197/yr at top step (plus HCAS in London). Using the 12.5% NHS CARE Pension Net-Pay arrangement reduces Adjusted Net Income to protect the £12,570 Personal Allowance from the £100,000 HMRC 60% tax trap.",
  },
  "director-of-operations": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "NHS Executive & Trust Board Leadership Standards",
    typicalQualification: "Postgraduate Executive Qualification + Acute/Mental Health Trust Operational Leadership",
    previousRoleSlug: "associate-director",
    nextRoleSlug: "chief-operating-officer",
    clinicalSummary:
      "Band 8d Hospital Directors of Operations oversee acute site delivery, urgent and emergency care (UEC) four-hour standards, elective surgical hubs, and multi-hundred-million-pound divisional budgets.",
    progressionSummary:
      "Band 8d progresses from Entry to Top Step after 5 years of service and leads directly to Band 9 Chief Operating Officer (COO).",
  },
  "chief-pharmacist": {
    category: "Pharmacy & Advanced Clinical Practice",
    registrationBody: "GPhC (General Pharmaceutical Council) & RPS",
    typicalQualification: "MPharm + GPhC Registration + Postgraduate Clinical & Executive Leadership",
    previousRoleSlug: "pharmacist",
    nextRoleSlug: "clinical-director",
    clinicalSummary:
      "Band 8d Trust Chief Pharmacists and Directors of Pharmacy & Medicines Optimisation serve as the statutory Controlled Drugs Accountable Officer (CDAO) and direct all clinical pharmacy services, aseptic manufacturing, and high-cost medicines budgets.",
    progressionSummary:
      "Band 8d Chief Pharmacists reach the top step after 5 years of service, with the largest multi-hospital teaching trusts grading Group Chief Pharmacists at Band 9.",
  },

  // Band 9
  "director-of-nursing": {
    category: "Nursing & Midwifery",
    registrationBody: "NMC (Nursing & Midwifery Council)",
    typicalQualification: "Registered Nurse/Midwife + Executive Board Credentialing",
    previousRoleSlug: "deputy-director-nursing",
    clinicalSummary:
      "Band 9 Executive Directors of Nursing and Regional Chief Nurses represent the pinnacle of the Agenda for Change nursing career structure, holding Board-level accountability for clinical quality, patient safety, and professional regulation.",
    progressionSummary:
      "Band 9 is the highest Agenda for Change pay band (£114,552 Entry to £131,617 Top Step after 5 years). At this salary level, the 12.5% pre-tax NHS Pension deduction is essential for mitigating the £100,000–£125,140 personal allowance taper.",
  },
  "chief-operating-officer": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "NHS Executive Board & Very Senior Manager (VSM) Interface",
    typicalQualification: "Executive Master's / MBA + Proven Acute or ICS Executive Track Record",
    previousRoleSlug: "director-of-operations",
    clinicalSummary:
      "Band 9 Chief Operating Officers (COOs) and Group Hospital Managing Directors command full operational delivery across major NHS Foundation Trusts and Integrated Care Systems.",
    progressionSummary:
      "Band 9 COOs progress from £114,552 Entry to £131,617 Top Step after 5 years of service, accruing over £2,120 to £2,437 per year in guaranteed index-linked 2015 CARE retirement pension.",
  },
  "clinical-director": {
    category: "Psychology, Healthcare Science & Leadership",
    registrationBody: "HCPC / NMC / GPhC / AHCS National Clinical Leadership",
    typicalQualification: "Doctorate / Consultant-Level Credentialing & National Specialist Advisory Track Record",
    previousRoleSlug: "consultant-scientist",
    clinicalSummary:
      "Band 9 National Clinical Specialist Advisors and Clinical Directors lead national NHS clinical networks, specialist commissioning frameworks, genomics hubs, and multi-professional clinical directorates.",
    progressionSummary:
      "Band 9 represents the ceiling of the national Agenda for Change pay spine, reaching £131,617 basic salary (up to £140,363 in Inner London with HCAS) at the 5-year top step.",
  },
};

export function getAllPseoEntries(): PseoEntry[] {
  return pseoData as PseoEntry[];
}

export function getPseoEntryBySlug(slug: string): PseoEntry | undefined {
  return (pseoData as PseoEntry[]).find((entry) => entry.slug === slug);
}

/**
 * Returns all 41 distinct NHS Job Role Pillar Hubs derived deterministically from
 * data/pseo_cities_roles.json and ordered by Agenda for Change Band (Band 2 -> Band 9).
 */
export function getAllRoleHubs(): RoleHubEntry[] {
  const allEntries = getAllPseoEntries();
  const roleMap = new Map<string, PseoEntry[]>();

  for (const entry of allEntries) {
    const existing = roleMap.get(entry.roleSlug);
    if (existing) {
      existing.push(entry);
    } else {
      roleMap.set(entry.roleSlug, [entry]);
    }
  }

  const hubs: RoleHubEntry[] = [];
  for (const [roleSlug, spokes] of roleMap.entries()) {
    const first = spokes[0];
    const bandObj = nhsData.bands.find((b) => b.band === first.band);
    const bandSlug = bandObj
      ? bandObj.slug
      : first.band.toLowerCase().replace(/\s+/g, "-");
    const meta = ROLE_METADATA[roleSlug] ?? {
      category: "Clinical Support & Phlebotomy",
      registrationBody: "NHS Agenda for Change Competency Framework",
      typicalQualification: "Relevant NHS Clinical or Professional Qualification",
      clinicalSummary: first.description,
      progressionSummary: `Annual progression across ${first.band} spine points is subject to statutory appraisal and reckonable years of NHS service.`,
    };

    hubs.push({
      roleSlug,
      roleName: first.roleName,
      band: first.band,
      bandSlug,
      regionalSpokes: spokes,
      ...meta,
    });
  }

  return hubs.sort(
    (a, b) => BAND_ORDER.indexOf(a.band) - BAND_ORDER.indexOf(b.band)
  );
}

export function getRoleHubBySlug(roleSlug: string): RoleHubEntry | undefined {
  return getAllRoleHubs().find((r) => r.roleSlug === roleSlug);
}

/**
 * Builds a complete 2-axis internal cross-linking mesh for any pSEO entry:
 * 1. sameRoleOtherRegions: Identical Band + Role across all other UK regions/HCAS zones.
 * 2. sameRegionOtherRoles: All other Bands & clinical roles within the exact same UK region,
 *    ordered by Agenda for Change band progression (Band 2 -> Band 9) with adjacent promotion bands highlighted.
 */
export function getRelatedPseoEntries(current: PseoEntry): {
  sameRoleOtherRegions: PseoEntry[];
  sameRegionOtherRoles: PseoEntry[];
  adjacentPromotionRoles: PseoEntry[];
} {
  const all = getAllPseoEntries();
  const currentBandIdx = BAND_ORDER.indexOf(current.band);

  const sameRoleOtherRegions = all.filter(
    (e) =>
      e.slug !== current.slug &&
      e.roleSlug === current.roleSlug &&
      e.band === current.band
  );

  const sameRegionOtherRoles = all
    .filter((e) => e.slug !== current.slug && e.regionId === current.regionId)
    .sort((a, b) => BAND_ORDER.indexOf(a.band) - BAND_ORDER.indexOf(b.band));

  const adjacentPromotionRoles = sameRegionOtherRoles.filter((e) => {
    const idx = BAND_ORDER.indexOf(e.band);
    return (
      currentBandIdx !== -1 &&
      idx !== -1 &&
      Math.abs(idx - currentBandIdx) === 1
    );
  });

  return {
    sameRoleOtherRegions,
    sameRegionOtherRoles,
    adjacentPromotionRoles,
  };
}

export function getRegionalEditorial(entry: PseoEntry) {
  const isLondon = entry.hcasZone === "inner-london" || entry.hcasZone === "outer-london";
  const isFringe = entry.hcasZone === "fringe";
  const isScotland = entry.regionId === "scotland";

  return {
    hcasExplanation: isLondon
      ? `As this post is situated within ${entry.regionName}, your salary includes the statutory High Cost Area Supplement (HCAS). Under Agenda for Change Annex 9, staff working in ${entry.hcasZone === "inner-london" ? "Inner London receive a 20% allowance (minimum £5,794, maximum £8,746)" : "Outer London receive a 15% allowance (minimum £4,870, maximum £6,137)"}. This supplement is pensionable under NHS pension regulations.`
      : isFringe
      ? `This post falls within the London Fringe boundary (Fringe zone), entitling staff to a 5% High Cost Area Supplement (minimum £1,346, maximum £2,270). This helps offset elevated living and commuting expenses in regions bordering Greater London.`
      : isScotland
      ? `In NHS Scotland, Agenda for Change salaries follow Scottish national agreements. Scottish taxpayers fall under the Scottish Parliament's devolved income tax bands (Starter 19%, Basic 20%, Intermediate 21%, Higher 42%, Advanced 45%, and Top 48%).`
      : `Staff in ${entry.regionName} are paid under the standard UK Agenda for Change national pay scales without London Weighting. Living expenses and housing costs in this region are significantly lower than Greater London, providing favorable real-terms purchasing power.`,
    careerProgression: `For a ${entry.roleName} in ${entry.band}, annual pay progression occurs through experience step-points. Newly qualified practitioners start at the entry point and progress upon completing designated years of service, subject to local statutory appraisal and competency sign-offs.`,
    pensionContext: `All NHS employees are contractually enrolled into the 2015 NHS Pension Scheme (Career Average Revalued Earnings - CARE). Employee contribution rates range from 5.2% up to 12.5% based on actual earnings. Contributions are deducted before Income Tax under Net Pay arrangements, providing automatic 20% to 40% tax relief at source.`,
  };
}
