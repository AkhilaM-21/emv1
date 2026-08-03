import { useTranslation } from 'react-i18next';

/* Single source of truth for hero copy across all four style variants.
   Same i18n keys the live AgenticHero uses, so the words never drift. */
export const useHeroContent = () => {
  const { t } = useTranslation();
  return {
    eyebrow: t('agenticHero.eyebrow', 'ONE BUSINESS OPERATING SYSTEM'),
    headline1: t('agenticHero.headline1', 'Run Your Entire Business on'),
    headline2: t('agenticHero.headline2', 'One Connected Platform.'),
    subtitle: t(
      'agenticHero.subtitle',
      'Finance, supply chain, sales, HR, payroll, POS, e-invoicing, projects, manufacturing and business workflows come together — so teams can run everyday operations with connected data and greater visibility across the business.',
    ),
    primaryCta: t('agenticHero.requestDemo', 'Request a Demo'),
    secondaryCta: t('agenticHero.secondaryCta', 'Explore the Platform'),
    getStartedCta: t('header.getStarted', 'Get Started'),
    /* Longer two-line variant for the centred layout, where the short
       headline left dead space either side of an 80%-wide column. */
    wideHeadline1: t('agenticHero.wideHeadline1', 'Run Finance, People, Sales & Operations'),
    wideHeadline2: t('agenticHero.wideHeadline2', 'on One Connected Business Platform.'),
  };
};

/* Modules shown as floating pills / tiles — mirrors AgenticHero's pill set. */
export const HERO_MODULES = [
  { key: 'fin', label: 'Financials', color: '#f2853f' },
  { key: 'sc', label: 'Supply Chain', color: '#3b82f6' },
  { key: 'crm', label: 'CRM', color: '#10b981' },
  { key: 'hcm', label: 'HCM', color: '#8b5cf6' },
  { key: 'proj', label: 'Projects', color: '#f59e0b' },
  { key: 'pos', label: 'POS', color: '#0ea5e9' },
  { key: 'einv', label: 'E-Invoicing', color: '#ec4899' },
];

export const TRUST_LOGOS = ['TAMIMI', 'ALMARAI', 'NESTO', 'LULU', 'ZAHRAN', 'BINDAWOOD'];
