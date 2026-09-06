import { ASSETS } from './data';

export type ProductCategorySlug =
  | 'fire-protection-system'
  | 'fire-detection-alarm-system'
  | 'fire-suppression-system'
  | 'fire-extinguisher'
  | 'ms-seamless-pipe';

export interface CategoryInfo {
  slug: ProductCategorySlug;
  name: string;
  displayName: string;
  path: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'fire-protection-system',
    name: 'Fire Protection System',
    displayName: 'FIRE PROTECTION SYSTEM',
    path: '/products/fire-protection-system',
    description: 'Comprehensive water-based and mechanical fire protection equipment including fire pumps, valves, hydrants, hoses, and sprinkler systems.',
  },
  {
    slug: 'fire-detection-alarm-system',
    name: 'Fire Detection & Alarm System',
    displayName: 'FIRE DETECTION & ALARM SYSTEM',
    path: '/products/fire-detection-alarm-system',
    description: 'Advanced early-warning addressable and conventional fire alarm panels, smoke/heat detectors, sounder strobes, and manual stations.',
  },
  {
    slug: 'fire-suppression-system',
    name: 'Fire Suppression System',
    displayName: 'FIRE SUPPRESSION SYSTEM',
    path: '/products/fire-suppression-system',
    description: 'Clean agent gas, CO2, foam, and kitchen hood fire suppression systems for sensitive server rooms, electrical rooms, and industrial hazards.',
  },
  {
    slug: 'fire-extinguisher',
    name: 'Fire Extinguisher',
    displayName: 'FIRE EXTINGUISHER',
    path: '/products/fire-extinguisher',
    description: 'UL-listed and certified dry powder (ABC/DCP), CO2, foam, water, and clean agent portable & trolley fire extinguishers.',
  },
  {
    slug: 'ms-seamless-pipe',
    name: 'MS Seamless Pipe',
    displayName: 'MS SEAMLESS PIPE',
    path: '/products/ms-seamless-pipe',
    description: 'ASTM A106 / A53 Schedule 40 & 80 seamless carbon steel and ERW fire fighting pipes, grooved couplings, and certified fittings.',
  },
];

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: ProductCategorySlug;
  image?: string;
  order: number;
  graphicType?: string;
  specs?: ProductSpecification[];
  description?: string;
}

// Maps the backend's image identifier (e.g. "fireDoor", "dieselPump") to the
// locally imported asset URL used for display on this site.
export const ITEM_BY_IMAGE: Record<string, string> = {
  fireDoor: ASSETS.fireDoor,
  dieselPump: ASSETS.dieselPump,
  electricPump: ASSETS.electricPump,
  jockeyPump: ASSETS.jockeyPump,
  controlPanel: ASSETS.controlPanel,
  hoseBox: ASSETS.hoseBox,
  hoseReel: ASSETS.hoseReel,
  hosePipe: ASSETS.hosePipe,
  butterflyValve: ASSETS.butterflyValve,
  reliefValve: ASSETS.reliefValve,
  landingValve: ASSETS.landingValve,
  checkValve: ASSETS.checkValve,
  inspection: ASSETS.inspection,
  extinguisher3kg: ASSETS.extinguisher3kg,
  extinguisher2kg: ASSETS.extinguisher2kg,
  extinguisher5kg: ASSETS.extinguisher5kg,
  extinguisherCo2: ASSETS.extinguisherCo2,
  prodSuppression: ASSETS.prodSuppression,
  prodExtinguisher: ASSETS.prodExtinguisher,
  prodAlarm: ASSETS.prodAlarm,
  prodPump: ASSETS.prodPump,
};

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

