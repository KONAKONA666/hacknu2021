import locales from '../../../core/locales';

export type Props = {
  language: typeof locales;
  suggestions: [string, number][];
};
