import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './Footer.css';

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
                <li className="footer-social">
                  <a href="#">
                    {t('footer.followUs', 'Follow us')} <Globe size={18} style={{ marginLeft: '8px' }} />
                  </a>
                </li>
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
