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
  /** When true and 2 options are selected, each delta is halved (e.g. half-and-half base) */
  halfAndHalf?: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  macroDelta: Partial<Macros>;
  isDefault?: boolean;
  /** Dietary tags — used to exclude this option when a conflicting dietary filter is active */
  tags?: string[];
}
