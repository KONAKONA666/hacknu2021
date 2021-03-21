import { Specialization } from '../../core/mock';

export type University = {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  specialties: Specialization[];
  weight?: string;
}
