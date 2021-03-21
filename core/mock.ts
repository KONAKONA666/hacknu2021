import { User } from '../components/types/User';
import { University } from '../components/types/University';

export type Specialization = {
  id: number;
  name: string;
  image: string;
  description: string;
  universities?: University[];
  rating?: number;
}

// Profile page
export type Profile = {
  user: User;
  recent_results: Specialization[];
  interests: string[];
}
