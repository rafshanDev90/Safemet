export interface Product {
  id: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
}

export interface AdvantageItem {
  id: string;
  title: string;
  content: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'drafting' | 'installation' | 'testing' | 'maintenance';
}

export interface PartnerBrand {
  id: string;
  name: string;
  logoType: 'tyco' | 'hochiki' | 'pentair' | 'lifeco' | 'naffco';
  subtitle?: string;
}

export interface TeamMember {
  id: string;
  title: string;
  image: string;
  description: string;
}

export interface HighlightFeature {
  id: string;
  title: string;
  description: string;
  icon: 'service' | 'support' | 'maintenance';
}
