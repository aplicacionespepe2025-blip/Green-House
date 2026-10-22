export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: 'Interior' | 'Exterior' | 'Floración' | 'Sombra' | 'Aromáticas' | 'Colgantes' | 'Arbustos y Árboles';
  price: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  // Cuidados específicos por especie
  careLight: string;
  careWater: string;
  careTemp: string;
  careSubstrate: string;
  careTips: string;
  difficulty: 'Muy fácil' | 'Fácil' | 'Moderado' | 'Experto';
  isPetFriendly: boolean;
  imageUrl: string;
  featured?: boolean;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 - 5
  comment: string;
  plantId?: string;
  plantName?: string;
  date: string;
  verified?: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plantInterest?: string;
  message: string;
  status: 'nuevo' | 'atendido' | 'archivado';
  createdAt: string;
}

export interface UserPlant {
  id: string;
  plantId?: string;
  plantName: string;
  nickname?: string;
  location?: string;
  lastWatered: string;
  waterFrequencyDays: number;
  notes?: string;
  addedAt: string;
}

export interface PlantFilterState {
  search: string;
  category: string;
  onlyInStock: boolean;
  difficulty: string;
  petFriendlyOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}
