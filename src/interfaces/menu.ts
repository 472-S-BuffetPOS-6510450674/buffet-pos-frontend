export interface BaseMenuResponse {
  bestSeller: any;
  id: string; // uuid.UUID corresponds to a string representation of a UUID
  name: string;
  description: string;
  categoryId: string; // uuid.UUID corresponds to a string representation of a UUID
  imageUrl: string;
  isAvailable: boolean;
}

export interface MenuDetail extends BaseMenuResponse {}

export interface AddMenuRequest {
  name: string;
  description?: string;
  categoryId?: string;
  isAvailable: boolean;
  image?: File;
}

export interface MenuFindByIDRequest {
  id: string; // Required field
}

export enum MenuStatus {
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface EditMenuRequest {
  id: string;
  name?: string;
  description?: string;
  categoryId?: string;
  isAvailable?: boolean;
  image?: File;
}