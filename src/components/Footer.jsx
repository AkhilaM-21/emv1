import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';


// Brand marks are not part of this lucide build, so the paths are inlined.
const SOCIAL_PATHS = [
  ['LinkedIn', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],
  ['X', 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z'],
  ['Facebook', 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'],
  ['Instagram', 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'],
  ['YouTube', 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'],
];

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-panel">
          {/* Main Footer Links & Newsletter */}
          <div className="footer-grid">
            
            {/* Column 1: Newsletter (Moved to left) */}
            <div className="footer-col col-newsletter">
              <div className="footer-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="#FF6B6B" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M16 8L8 13V19L16 24L24 19V13L16 8Z" stroke="#4ECDC4" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <span className="logo-text-footer">Emvive</span>
              </div>
              
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input type="email" id="email" required placeholder=" " />
                  <label htmlFor="email">{t('footer.emailPlaceholder', 'Email Address*')}</label>
                </div>
                
                <div className="checkbox-group">
                  <input type="checkbox" id="privacy-consent" required />
                  <label htmlFor="privacy-consent">
                    {t('footer.privacyConsent1', 'I agree to Emvive processing my personal data in accordance with Emvive\'s')} <a href="#">{t('footer.privacyConsent2', 'Privacy Policy')}</a>.
                  </label>
                </div>
                
                <button type="submit" className="subscribe-btn">
                  {t('footer.subscribe', 'SUBSCRIBE')}
                </button>
              </form>

              {/* decorative only — no destinations wired up yet */}
              <div className="footer-socials">
                {SOCIAL_PATHS.map(([name, d]) => (
                  <button key={name} type="button" className="footer-social-btn" aria-label={name}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d={d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Column 2: Products (Large text) */}
            <div className="footer-col col-large">
              <h4 className="footer-heading">{t('footer.productsTitle', 'PRODUCTS')}</h4>
              <ul className="footer-links large-links">
                <li><a href="#products">{t('megaMenu.products.cloudErp', 'Cloud ERP')}</a></li>
                <li><a href="#products">{t('megaMenu.products.hrPayroll', 'HR & Payroll')}</a></li>
                <li><a href="#products">{t('megaMenu.products.crmSales', 'CRM & Sales')}</a></li>
                <li><a href="#products">{t('megaMenu.products.reporting', 'Advanced Reporting')}</a></li>
                <li><a href="#products">{t('megaMenu.products.workflow', 'Workflow Automation')}</a></li>
                <li><a href="#products">{t('megaMenu.products.noCode', 'E-Invoicing')}</a></li>
              </ul>
            </div>

            {/* Column 3: Industries */}
            <div className="footer-col">
              <h4 className="footer-heading">{t('footer.industriesTitle', 'INDUSTRIES')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.industry.Manufacturing', 'Manufacturing')}</a></li>
                <li><a href="#">{t('footer.industry.Retail', 'Retail & E-commerce')}</a></li>
                <li><a href="#">{t('footer.industry.Healthcare', 'Healthcare')}</a></li>
                <li><a href="#">{t('footer.industry.Financial', 'Financial Services')}</a></li>
                <li><a href="#">{t('footer.industry.Logistics', 'Logistics & Supply Chain')}</a></li>
                <li><a href="#">{t('footer.industry.Technology', 'Technology & SaaS')}</a></li>
                <li><a href="#">{t('footer.industry.Government', 'Government & Public Sector')}</a></li>
              </ul>
            </div>

            {/* Column 4: Legal & Social Pills */}
            <div className="footer-col">
              <h4 className="footer-heading">{t('footer.legalTitle', 'LEGAL & SOCIAL')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.legal.terms', 'Terms of Service')}</a></li>
                <li><a href="#">{t('footer.legal.privacy', 'Privacy Policy')}</a></li>
                <li><a href="#">{t('footer.legal.cookie', 'Cookie Policy')}</a></li>
                <li><a href="#">{t('footer.legal.brand', 'Brand Guidelines')}</a></li>
              </ul>
            </div>
            
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; 2026 Emvive Inc.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
