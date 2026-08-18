import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion, Reveal, MaskText, EASE } from './motion';
import './sections.css';

/* =====================================================================
   SHARED SECTION FURNITURE

   Finance's sections are built out of three repeating pieces: a head, a
   grid of feature cards, and a grid of clean panel cards. Supply Chain
   and Platform each built their own version of the same three, which is
   why the products stopped looking related.

   These are those pieces, taken out of Finance and made to take their
   content as props. A section converted to them is content plus one
   component call rather than its own markup and stylesheet, so the next
   section converted is cheap and the three pages cannot drift again.

   Namespace `ux-`. Colour comes from --accent, set per page by
   ProductPage, or per item from the `c` field.

   Finance still runs its own copies for now; it is the reference these
   match, and re-pointing a page nobody has complained about is a change
   with risk and no visible reward.
   ===================================================================== */

/* colour for one item — a hex from the data, or the page accent */
const tone = (c) => ({ '--c': c || 'var(--accent)' });

/* ---------------------------------------------------------------
   The head every section opens with: pill eyebrow, headline whose
   answer half is a gradient, and a lede.
   --------------------------------------------------------------- */
export const SectionHead = ({ label, title, accent, lede, className = '' }) => (
  <div className={`ux-head ${className}`}>
    {label && (
      <Reveal duration={0.7}>
        <span className="ux-kick"><i aria-hidden="true" />{label}</span>
      </Reveal>
    )}

    <MaskText text={title} accent={accent} as="h2" className="ux-h2" />

    {lede && <Reveal delay={0.2} y={14}><p className="ux-lede">{lede}</p></Reveal>}
  </div>
);

/* ---------------------------------------------------------------
   FEATURE GRID
   An icon chip, a rule, a title and a line of prose. For a list of
   things the product does, where each one needs a sentence.

   items: [{ k, t, d, icon, c }]  — k is the small name over the rule
   --------------------------------------------------------------- */
export const FeatureGrid = ({ items = [], cols = 2, className = '' }) => (
  <div className={`ux-features cols-${cols} ${className}`}>
    {items.map((it, i) => (
      <motion.div
        className="ux-feature"
        key={it.t || it.k}
        style={tone(it.c)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        {(it.icon || it.k) && (
          <div className="ux-feature-top">
            {it.icon && (
              <span className="ux-feature-ic">
                <it.icon size={20} strokeWidth={2.2} />
              </span>
            )}
            {it.k && <span className="ux-feature-name">{it.k}</span>}
          </div>
        )}

        <div className="ux-feature-head">
          <span className="ux-feature-bar" />
          <h3 className="ux-feature-title">{it.t}</h3>
        </div>

        {it.d && <p className="ux-feature-desc">{it.d}</p>}

        {it.note && <span className="ux-feature-note">{it.note}</span>}
      </motion.div>
    ))}
  </div>
);

/* ---------------------------------------------------------------
   CARD GRID
   The clean panel card: white, hairline border, generous radius, with
   room under the copy for a drawing. For a set of claims that each
   want their own surface.

   items: [{ t, d, span, graphic }]  — span is in 6ths, as on Finance
   --------------------------------------------------------------- */
export const CardGrid = ({ items = [], className = '' }) => (
  <div className={`ux-cards ${className}`}>
    {items.map((it, i) => (
      <Reveal
        className="ux-card"
        style={{ gridColumn: `span ${it.span || 2}`, ...tone(it.c) }}
        key={it.t}
        delay={i * 0.06}
      >
        <div className="ux-card-text">
          <h3>{it.t}</h3>
          <p>{it.d}</p>
        </div>

        {it.graphic && <div className="ux-card-graphic">{it.graphic}</div>}
      </Reveal>
    ))}
  </div>
);

/* ---------------------------------------------------------------
   ACCORDION SHOWCASE
   Finance's capabilities section: a list the reader drives on the left,
   the matching visual on the right. One open at a time.

   items: [{ k, body, icon, c, img, video }]
   --------------------------------------------------------------- */
export const AccordionShowcase = ({ items = [], className = '' }) => {
  const [open, setOpen] = useState(0);
  const active = items[open] || items[0];

  return (
    <div className={`ux-show ${className}`}>
      <div className="ux-acc">
        {items.map((it, i) => (
          <div className={`ux-acc-item ${i === open ? 'on' : ''}`} key={it.k} style={tone(it.c)}>
            <button
              type="button"
              className="ux-acc-head"
              onClick={() => setOpen(i)}
              aria-expanded={i === open}
            >
              <span className="ux-acc-name">
                {it.icon && <it.icon size={20} strokeWidth={2.2} className="ux-acc-ic" />}
                <span className="ux-acc-t">{it.k}</span>
              </span>

              <span className="ux-acc-chev">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points={i === open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                </svg>
              </span>
            </button>

            <AnimatePresence>
              {i === open && it.body && (
                <motion.div
                  className="ux-acc-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="ux-acc-body-in"><p>{it.body}</p></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="ux-show-visual" style={tone(active?.c)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={open}
            className="ux-show-visual-in"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {active?.video
              ? <video src={active.video} muted loop autoPlay playsInline />
              : active?.img && <img src={active.img} alt={active.k} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   SPLIT FEATURE
   Finance's "how it works": a tall image card carrying a headline of
   its own, with the feature grid beside it. For a section that has one
   strong visual and a set of points to put next to it.
   --------------------------------------------------------------- */
export const SplitFeature = ({
  image, alt = '', title, body, items = [], cols = 2, children, className = '',
}) => (
  <div className={`ux-split ${className}`}>
    <motion.div
      className="ux-tall"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {image && <img src={image} alt={alt} className="ux-tall-img" />}
      <span className="ux-tall-wash" aria-hidden="true" />
      {(title || body) && (
        <div className="ux-tall-copy">
          {title && <h3>{title}</h3>}
          {body && <p>{body}</p>}
        </div>
      )}
    </motion.div>

    {/* the caller can hand in its own right-hand side — a screen, a
        video, a live panel — instead of the feature grid */}
    <div>{children || <FeatureGrid cols={cols} items={items} />}</div>
  </div>
);

/* ---------------------------------------------------------------
   FOLDER GRID
   Finance's capabilities grid: a tabbed folder per module, its points
   listed beside a large icon.

   items: [{ k, points, icon, c }]
   --------------------------------------------------------------- */
export const FolderGrid = ({ items = [], className = '' }) => (
  <div className={`ux-folders ${className}`}>
    {items.map((it, i) => (
      <motion.div
        className="ux-folder"
        key={it.k}
        style={tone(it.c)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        <div className="ux-folder-tab">{it.k}</div>

        <div className="ux-folder-body">
          {it.icon && (
            <div className="ux-folder-ic"><it.icon size={48} strokeWidth={1.2} /></div>
          )}
          <div className="ux-folder-rule" />
          <ul className="ux-folder-points">
            {(it.points || []).slice(0, 5).map((p) => (
              <li key={p}><i /><span>{p}</span></li>
            ))}
          </ul>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ---------------------------------------------------------------
   OFFERINGS CARD
   Finance's automation section: tabs down the left, a visual and the
   selected tab's list on the right, all inside one card.

   tabs: [{ label, items: [string] }]
   --------------------------------------------------------------- */
export const OfferingsCard = ({
  title, note, tabs = [], image, className = '',
}) => {
  const [on, setOn] = useState(0);
  const active = tabs[on] || tabs[0];

  return (
    <div className={`ux-offer ${className}`}>
      <div className="ux-offer-left">
        <h3>{title}</h3>
        {note && <p>{note}</p>}

        <div className="ux-offer-tabs">
          {tabs.map((t, i) => (
            <button
              type="button"
              key={t.label}
              className={`ux-offer-tab ${i === on ? 'on' : ''}`}
              onClick={() => setOn(i)}
              aria-pressed={i === on}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ux-offer-right">
        {image && (
          <div className="ux-offer-visual">
            <img src={image} alt="" />
          </div>
        )}

        <div className="ux-offer-list">
          {(active?.items || []).map((it, i) => (
            <span key={it}>{String(i + 1).padStart(2, '0')}. {it}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   IMPACT PANEL
   Finance's "what changes in the first year": a measured before/after
   card and four figures on a grey ground, a photograph filling the
   other half, and three quotes centred on it.

   bars:    { k, sub, scale, rows: [{ k, note, v, tone }], claim }
   figures: [{ icon, value, suffix, label }]
   --------------------------------------------------------------- */
export const ImpactPanel = ({
  bars, figures = [], photo, alt = '', quotes = [], className = '',
}) => {
  const pct = (v) => `${(v / (bars?.scale || 100)) * 100}%`;

  return (
    <div className={`ux-impact ${className}`}>
      <div className="ux-impact-left">
        <Reveal className="ux-bars" y={22}>
          <div className="ux-bars-top">
            <span className="ux-bars-k">{bars?.k}</span>
            <span className="ux-bars-sub">{bars?.sub}</span>
          </div>

          {(bars?.rows || []).map((r, i) => (
            <div className={`ux-bar-row ${r.tone || ''}`} key={r.k}>
              <span className="ux-bar-label">
                <b>{r.k}</b>
                {r.note && <em>{r.note}</em>}
              </span>

              <span className="ux-bar-track">
                <motion.i
                  style={{ width: pct(r.v) }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.05, delay: 0.25 + i * 0.2, ease: EASE }}
                />
              </span>

              <span className="ux-bar-val"><b>{r.v}</b>{bars.unit}</span>
            </div>
          ))}

          {bars?.claim && (
            <div className="ux-claim">
              <b>{bars.claim.v}</b>
              {bars.claim.label}
            </div>
          )}
        </Reveal>

        <div className="ux-figures">
          {figures.map((f, i) => (
            <Reveal className="ux-figure" key={f.label} delay={i * 0.08}>
              <span className="ux-figure-ic"><f.icon size={22} strokeWidth={2} /></span>
              <div>
                <b>{f.value}<span>{f.suffix}</span></b>
                <p>{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="ux-impact-photo">
        {photo && <img src={photo} alt={alt} />}
      </div>

      <div className="ux-quotes">
        {quotes.map((q, i) => (
          <Reveal className="ux-quote" key={q} delay={0.1 + i * 0.1}>
            <span className="ux-quote-mark">❝</span>
            <p>{q}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   NUMBERED LIST
   A counted rundown — 01, 02, 03 — with a name and a line each. For
   the "what it manages" kind of block that reads as an inventory.
   --------------------------------------------------------------- */
export const NumberedList = ({ items = [], label, className = '' }) => (
  <Reveal className={`ux-list ${className}`} y={22}>
    {label && <span className="ux-list-k">{label}</span>}

    {items.map(([t, d], i) => (
      <motion.div
        className="ux-list-row"
        key={t}
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        <span className="ux-list-n">{String(i + 1).padStart(2, '0')}</span>
        <div><b>{t}</b><em>{d}</em></div>
      </motion.div>
    ))}
  </Reveal>
);
