import { AdvantageItem, ProjectItem, ServiceItem, PartnerBrand, TeamMember, HighlightFeature } from './types';

// Generated Asset URLs
import heroCabinetImg from './assets/images/fire_cabinet_hero_1788228494243.jpg';
import firefighterBgImg from './assets/images/firefighter_quote_bg_1788228474718.jpg';
import tvcWomanImg from './assets/images/tvc_woman_fire_safety_1788228515408.jpg';
import inspectionImg from './assets/images/fire_safety_inspection_1788228535320.jpg';
import prodExtinguisherImg from './assets/images/prod_fire_extinguishers_1788228553035.jpg';
import prodAlarmImg from './assets/images/prod_alarm_system_1788228571493.jpg';
import prodPumpImg from './assets/images/prod_protection_pump_1788228591110.jpg';
import prodSuppressionImg from './assets/images/prod_suppression_sys_1788228610824.jpg';

// About Us Page Assets
import aboutBannerImg from './assets/images/about_banner_composite_1788229213031.jpg';
import ceoImg from './assets/images/ceo_portrait_1788229236583.jpg';
import mdImg from './assets/images/md_portrait_1788229253570.jpg';
import cooImg from './assets/images/coo_portrait_1788229270760.jpg';

// Product Detail & Night Cityline Assets
import nightCitySkylineImg from './assets/images/night_city_skyline_banner_1788244421462.jpg';
import extinguisher3kgImg from './assets/images/extinguisher_3kg_dcp_1788244438537.jpg';
import extinguisher2kgImg from './assets/images/extinguisher_2kg_dcp_1788244454877.jpg';
import extinguisher5kgImg from './assets/images/extinguisher_5kg_dcp_1788244467057.jpg';
import extinguisherCo2Img from './assets/images/extinguisher_co2_2kg_1788244490856.jpg';

// Fire Protection System Category Assets
import fireDoorImg from './assets/images/prod_fire_door_1788245068028.jpg';
import dieselPumpImg from './assets/images/prod_diesel_fire_pump_1788245086296.jpg';
import electricPumpImg from './assets/images/prod_electric_fire_pump_1788245105493.jpg';
import jockeyPumpImg from './assets/images/prod_jockey_pump_1788245123122.jpg';
import controlPanelImg from './assets/images/prod_fire_control_panel_1788245143290.jpg';
import hoseBoxImg from './assets/images/prod_hose_box_1788245161606.jpg';
import hoseReelImg from './assets/images/prod_hose_reel_1788245179383.jpg';
import hosePipeImg from './assets/images/prod_hose_pipe_1788245198094.jpg';
import butterflyValveImg from './assets/images/prod_butterfly_valve_1788245213561.jpg';
import reliefValveImg from './assets/images/prod_relief_valve_1788245233207.jpg';
import landingValveImg from './assets/images/prod_landing_valve_1788245250934.jpg';
import checkValveImg from './assets/images/prod_check_valve_1788245268070.jpg';

export const ASSETS = {
  heroCabinet: heroCabinetImg,
  firefighterBg: firefighterBgImg,
  tvcWoman: tvcWomanImg,
  inspection: inspectionImg,
  prodExtinguisher: prodExtinguisherImg,
  prodAlarm: prodAlarmImg,
  prodPump: prodPumpImg,
  prodSuppression: prodSuppressionImg,
  aboutBanner: aboutBannerImg,
  ceo: ceoImg,
  md: mdImg,
  coo: cooImg,
  nightCitySkyline: nightCitySkylineImg,
  extinguisher3kg: extinguisher3kgImg,
  extinguisher2kg: extinguisher2kgImg,
  extinguisher5kg: extinguisher5kgImg,
  extinguisherCo2: extinguisherCo2Img,
  fireDoor: fireDoorImg,
  dieselPump: dieselPumpImg,
  electricPump: electricPumpImg,
  jockeyPump: jockeyPumpImg,
  controlPanel: controlPanelImg,
  hoseBox: hoseBoxImg,
  hoseReel: hoseReelImg,
  hosePipe: hosePipeImg,
  butterflyValve: butterflyValveImg,
  reliefValve: reliefValveImg,
  landingValve: landingValveImg,
  checkValve: checkValveImg,
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    title: 'CHAIRMAN AND CEO',
    image: ceoImg,
    description: 'Chairman and CEO of RN GROUP Group',
  },
  {
    id: 'team-2',
    title: 'MANAGING DIRECTOR',
    image: mdImg,
    description: 'Managing Director of RN GROUP Group',
  },
  {
    id: 'team-3',
    title: 'CHIEF OPERATING OFFICER',
    image: cooImg,
    description: 'Chief Operating Officer of RMIL and FSE.',
  },
];

export const HIGHLIGHT_FEATURES: HighlightFeature[] = [
  {
    id: 'feat-1',
    title: '24/7 SERVICE',
    icon: 'service',
    description:
      'The one-stop call center 09613737777 has a solution for emergency, complaints exploration, installation, troubleshooting and after sales support round the clock.',
  },
  {
    id: 'feat-2',
    title: 'TECHNICAL SUPPORT AND TRAINING',
    icon: 'support',
    description:
      'The after sales and installation service includes staff training, explanation of usage & routine check up to ensure fire safety readiness at all times.',
  },
  {
    id: 'feat-3',
    title: 'CONTINUED ROUTINE MAINTENANCE',
    icon: 'maintenance',
    description:
      'Every fortnightly preventative routine maintenance (cleaning, lubrication, adjustment) to ensure that your fire protection systems operate without failure.',
  },
];

export const ADVANTAGES: AdvantageItem[] = [
  {
    id: 'adv-1',
    title: 'Extensive Experience',
    content: 'Since 2015, we have been selling world top class branded fire safety equipment.',
  },
  {
    id: 'adv-2',
    title: 'Quality from start to finish',
    content: 'Uncompromising standard verification, factory testing, and certified fire safety engineering compliance.',
  },
  {
    id: 'adv-3',
    title: 'UL listed and FM approved',
    content: 'All our equipment meets rigorous international standards from Underwriters Laboratories and Factory Mutual.',
  },
  {
    id: 'adv-4',
    title: 'Best service provider',
    content: 'Dedicated round-the-clock technical emergency support, preventive maintenance, and expert installation team.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'MUAZUDDIN TEXTILES LTD.',
    category: 'Textile & Garments',
    location: 'Gazipur',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-2',
    title: 'KAIZER KNITWEAR LTD.',
    category: 'Textile & Garments',
    location: 'Narayanganj',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-3',
    title: 'SENA KALYAN BUSINESS MART',
    category: 'Commercial & Corporate',
    location: 'Dhaka',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-4',
    title: 'REEDISHA GROUP',
    category: 'Industrial Conglomerate',
    location: 'Tejgaon',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-5',
    title: 'SHARMIN GROUP',
    category: 'Apparel & Textiles',
    location: 'Ashulia',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-6',
    title: 'HA-MEEM GROUP',
    category: 'Textile & Garments',
    location: 'Dhaka',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-7',
    title: 'SUMMIT NARAYANGANJ POWER PLANT',
    category: 'Power & Energy',
    location: 'Narayanganj',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-8',
    title: 'BHERAMARA 410MW POWER PLANT',
    category: 'Power & Energy',
    location: 'Kushtia',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-9',
    title: 'ASHUGANJ POWER PLANT',
    category: 'Power & Energy',
    location: 'Brahmanbaria',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-10',
    title: 'IMPETUS CONSTRUCTION',
    category: 'Commercial Architecture',
    location: 'Tejgaon I/A',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-11',
    title: 'MIRPUR DOHS SHOPPING',
    category: 'Commercial Retail',
    location: 'Mirpur DOHS',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-12',
    title: 'SKS SHOPPING COMPLEX',
    category: 'Commercial Retail',
    location: 'Mohakhali',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-13',
    title: 'RAJSHAHI NOVO THEATER',
    category: 'Institutional & Culture',
    location: 'Rajshahi',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-14',
    title: 'NEURO SCIENCE BUILDING',
    category: 'Healthcare & Hospital',
    location: 'Agargaon, Dhaka',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-15',
    title: 'SHEIKH HASINA MEDICAL COLLEGE',
    category: 'Healthcare & Education',
    location: 'Jamalpur',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-16',
    title: 'WORLD BANK-DHAKA',
    category: 'International Institution',
    location: 'Agargaon, Dhaka',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-17',
    title: 'HAZRAT SHAHJALAL INT. AIRPORT TERMINAL-03',
    category: 'Aviation Infrastructure',
    location: 'Kurmitola, Dhaka',
    image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'proj-18',
    title: 'BANGLADESH BANK',
    category: 'Financial & Government',
    location: 'Motijheel, Dhaka',
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=800&auto=format&fit=crop',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'DESIGN & DRAWING',
    iconName: 'drafting',
    description: 'Fire safety design and drawing according to the requirement.',
  },
  {
    id: 'srv-2',
    title: 'SYSTEM INSTALLATION',
    iconName: 'installation',
    description: 'Proper installation of Fire Safety Equipment system.',
  },
  {
    id: 'srv-3',
    title: 'TESTING & COMMISSIONING',
    iconName: 'testing',
    description: 'After successfully install the system, our testing and commissioning team check and recheck the overall system.',
  },
  {
    id: 'srv-4',
    title: 'MAINTENANCE',
    iconName: 'maintenance',
    description: 'We provide comprehensive customer care, after sales service and proper maintenance of the system.',
  },
];

export const PARTNERS: PartnerBrand[] = [
  {
    id: 'p-1',
    name: 'tyco',
    logoType: 'tyco',
    subtitle: 'Fire Protection Products',
  },
  {
    id: 'p-2',
    name: 'HOCHIKI',
    logoType: 'hochiki',
    subtitle: 'Fire Alarm System',
  },
  {
    id: 'p-3',
    name: 'PENTAIR',
    logoType: 'pentair',
    subtitle: 'Water & Fire Pumps',
  },
  {
    id: 'p-4',
    name: 'LIFECO',
    logoType: 'lifeco',
    subtitle: 'Fire & Safety Equipment Co. Ltd.',
  },
  {
    id: 'p-5',
    name: 'NAFFCO',
    logoType: 'naffco',
    subtitle: 'National Fire Fighting Mfg.',
  },
];


