import { Macros } from './macros';

export interface MenuItem {
  id: string;
  restaurantSlug: string;
  name: string;
  category: string;
  description?: string;
  baseMacros: Macros;
  servingSize?: string;
  isPopular?: boolean;
  tags?: string[];
  customizationGroups?: CustomizationGroup[];
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multi';
  required: boolean;
  maxSelections?: number;
  defaultOptionId?: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  macroDelta: Partial<Macros>;
  isDefault?: boolean;
}
