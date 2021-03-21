import locales from '../../../core/locales';
import { Specialization } from '../../../core/mock';

export type Props = {
  language: typeof locales;
  specialties: Specialization[];
};
