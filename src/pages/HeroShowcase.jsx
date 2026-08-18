import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import HeroCrisp from '../components/hero/variants/HeroCrisp';
import HeroWipro from '../components/hero/variants/HeroWipro';
import HeroDashboard from '../components/hero/variants/HeroDashboard';
import HeroCoframe from '../components/hero/variants/HeroCoframe';
import HeroInfosys from '../components/hero/variants/HeroInfosys';
import './HeroShowcase.css';

/* /home — four hero treatments of the same copy. A corner dropdown switches
   between them so the page itself stays uncluttered for the client. */

const STYLES = [
  { id: 1, name: 'Home 1', sub: 'Centered', Component: HeroCrisp },
  { id: 2, name: 'Home 2', sub: 'Dashboards', Component: HeroDashboard },
  { id: 3, name: 'Home 3', sub: 'Full-bleed', Component: HeroWipro },
  { id: 4, name: 'Home 4', sub: 'Framed screen', Component: HeroCoframe },
  { id: 5, name: 'Home 5', sub: 'Film + copy', Component: HeroInfosys },
];

const HeroShowcase = () => {
  /* the router's params, not window.location.search — under HashRouter the
     query lives inside the hash (#/home?style=3), where window.location
     .search is always empty and history.replaceState would blow the route away */
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const requested = Number(params.get('style'));
  const active = STYLES.some((s) => s.id === requested) ? requested : 1;

  const select = useCallback((id) => {
    setOpen(false);
    setParams({ style: String(id) }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setParams]);

  /* close on outside click */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  /* Esc closes, arrows step through the variants */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') select(active === STYLES.length ? 1 : active + 1);
      if (e.key === 'ArrowLeft') select(active === 1 ? STYLES.length : active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, select]);

  const current = STYLES.find((s) => s.id === active) || STYLES[0];
  const Active = current.Component;

  return (
    <div className="hs-page">
      <Active />

      <div className={`hs-picker ${open ? 'is-open' : ''}`} ref={wrapRef}>
        {open && (
          <ul className="hs-menu" role="listbox">
            {STYLES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active === s.id}
                  className={`hs-option ${active === s.id ? 'on' : ''}`}
                  onClick={() => select(s.id)}
                >
                  <span className="hs-option-num">{s.id}</span>
                  <span className="hs-option-txt">
                    <b>{s.name}</b>
                    <em>{s.sub}</em>
                  </span>
                  {active === s.id && <Check size={15} className="hs-option-tick" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="hs-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="hs-trigger-num">{current.id}</span>
          <span className="hs-trigger-txt">{current.name}</span>
          <ChevronDown size={15} className="hs-trigger-caret" />
        </button>
      </div>
    </div>
  );
};

export default HeroShowcase;
