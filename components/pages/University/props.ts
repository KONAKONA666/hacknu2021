import locales from '../../../core/locales';
import { University } from '../../types/University';

export type Props = {
  language: typeof locales;
  university: University;
};
