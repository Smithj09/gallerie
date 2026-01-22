
export interface SolarProject {
  id: string;
  imageUrl: string;
  description: string;
  rating: number;
  date: string;
  location: string;
}

export type NewProject = Omit<SolarProject, 'id' | 'date'>;
