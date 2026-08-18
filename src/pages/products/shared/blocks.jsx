import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Minus } from 'lucide-react';
import { motion, Reveal, MaskText, EASE } from './motion';
import './blocks.css';

/* =====================================================================
   SHARED IA BLOCKS

   Three sections appear on all three product pages and carry the same
   job on each: establish trust, answer objections, and open a
   conversation. They share markup so they behave identically, and take
   their tone, accent and *content* from the page — which is where the
   three products actually differ.

   Namespace `bk-`. Each page tints it through --accent.
   ===================================================================== */

/* ---------------------------------------------------------------
   TRUSTED BY / ENTERPRISE TRUST
   Customer wordmarks beside the handful of facts a buyer checks
   before they will read anything else.
   --------------------------------------------------------------- */
export const TrustBand = ({ label, logos = [], proofs = [], tone = '', note }) => (
  <section className={`bk-trust ${tone}`} id="trust">
    <div className="bk-shell">
      <Reveal duration={0.7}>
        <span className="bk-trust-label">{label}</span>
      </Reveal>

      <div className="bk-logos">
        {logos.map((l, i) => (
          <Reveal key={l} delay={i * 0.04} duration={0.6}>
            <span className="bk-logo">{l}</span>
          </Reveal>
        ))}
      </div>

      <div className="bk-proofs">
        {proofs.map(({ icon: Icon, value, label: pl }, i) => (
          <Reveal className="bk-proof" key={pl} delay={0.08 + i * 0.05}>
            {Icon && <Icon size={15} strokeWidth={1.7} />}
            <b>{value}</b>
            <span>{pl}</span>
          </Reveal>
        ))}
      </div>

      {note && <Reveal delay={0.2}><p className="bk-trust-note">{note}</p></Reveal>}
    </div>
  </section>
);

/* ---------------------------------------------------------------
   FAQ
   One open at a time. The grid-rows 0fr→1fr trick animates to the
   content's real height without measuring it in JavaScript.
   --------------------------------------------------------------- */
export const Faq = ({ id = 'faq', eyebrow, title, accent, lede, items = [], tone = '', aside }) => {
  const [open, setOpen] = useState(0);

  return (
    <section className={`bk-faq ${tone}`} id={id}>
      <div className="bk-shell bk-faq-in">
        <div className="bk-faq-head">
          <Reveal duration={0.7}><span className="bk-eyebrow">{eyebrow}</span></Reveal>
          <MaskText text={title} accent={accent} as="h2" className="bk-h2" />
          {lede && <Reveal delay={0.16} y={14}><p className="bk-lede">{lede}</p></Reveal>}
          {aside && <Reveal delay={0.22} y={14}><div className="bk-faq-aside">{aside}</div></Reveal>}
        </div>

        <div className="bk-faq-list">
          {items.map((it, i) => (
            <div className={`bk-q ${open === i ? 'on' : ''}`} key={it.q}>
              <button
                type="button"
                className="bk-q-head"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="bk-q-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="bk-q-t">{it.q}</span>
                <span className="bk-q-ic">
                  {open === i ? <Minus size={14} strokeWidth={2} /> : <ChevronDown size={14} strokeWidth={2} />}
                </span>
              </button>

              <div className="bk-q-body">
                <div>
                  <p>{it.a}</p>
                  {it.points && (
                    <ul className="bk-q-points">
                      {it.points.map((p) => <li key={p}><Check size={12} strokeWidth={3} />{p}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   CONTACT / DEMO FORM

   No endpoint exists yet, so submit is intercepted and answered with
   an honest acknowledgement rather than pretending to post. Wire
   `onSubmit` to the real handler when the backend lands — the field
   values are already collected in `values`.
   --------------------------------------------------------------- */
const Field = ({ f, value, onChange }) => {
  const id = `bk-${f.name}`;

  if (f.type === 'choice') {
    return (
      <div className={`bk-field span-${f.span || 1}`}>
        <span className="bk-label">{f.label}{f.required && <i>*</i>}</span>
        <div className="bk-choices" role="radiogroup" aria-label={f.label}>
          {f.options.map((o) => (
            <button
              type="button"
              role="radio"
              aria-checked={value === o}
              key={o}
              className={value === o ? 'on' : ''}
              onClick={() => onChange(f.name, o)}
            >
              {value === o && <Check size={12} strokeWidth={3} />}
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bk-field span-${f.span || 1}`}>
      <label className="bk-label" htmlFor={id}>{f.label}{f.required && <i>*</i>}</label>

      {f.type === 'select' && (
        <div className="bk-select">
          <select
            id={id}
            name={f.name}
            required={f.required}
            value={value || ''}
            onChange={(e) => onChange(f.name, e.target.value)}
          >
            <option value="" disabled>{f.placeholder || 'Select…'}</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={14} strokeWidth={2} />
        </div>
      )}

      {f.type === 'textarea' && (
        <textarea
          id={id}
          name={f.name}
          rows={f.rows || 4}
          required={f.required}
          placeholder={f.placeholder}
          value={value || ''}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      )}

      {(!f.type || f.type === 'text' || f.type === 'email') && (
        <input
          id={id}
          name={f.name}
          type={f.type === 'email' ? 'email' : 'text'}
          required={f.required}
          placeholder={f.placeholder}
          autoComplete={f.autoComplete}
          value={value || ''}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      )}
    </div>
  );
};

export const ContactSection = ({
  id = 'start', eyebrow, title, accent, lede, fields = [], cta,
  aside, reply = 'One of our team replies within one business day.',
  tone = '', className = '', variant = '', panel = {},
}) => {
  const [values, setValues] = useState({});
  const [sent, setSent] = useState(false);

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));

  const submit = (e) => {
    e.preventDefault();
    /* TODO: POST `values` once the enquiry endpoint exists. */
    setSent(true);
  };

  /* The three pieces are built once here and then placed by whichever
     layout is in use below, so the two arrangements cannot drift apart
     — the form in particular is the only copy of itself. */
  const head = (
    <>
      <Reveal duration={0.7}><span className="bk-eyebrow">{eyebrow}</span></Reveal>
      <MaskText text={title} accent={accent} as="h2" className="bk-h2" />
      {lede && <Reveal delay={0.16} y={14}><p className="bk-lede">{lede}</p></Reveal>}
    </>
  );

  const rows = aside && aside.map(({ icon: Icon, t, d }) => (
    <div className="bk-aside-row" key={t}>
      <span className="bk-aside-ic"><Icon size={15} strokeWidth={1.8} /></span>
      <div><b>{t}</b><em>{d}</em></div>
    </div>
  ));

  const body = sent ? (
    <motion.div
      className="bk-sent"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className="bk-sent-ic"><Check size={22} strokeWidth={2.6} /></span>
      <h3>Thank you — that&apos;s with us.</h3>
      <p>
        {reply} If it is urgent, reply to the confirmation email and it
        will reach the same people directly.
      </p>
      <button type="button" className="bk-sent-again" onClick={() => { setSent(false); setValues({}); }}>
        Send another enquiry
      </button>
    </motion.div>
  ) : (
    <form className="bk-form" onSubmit={submit} noValidate={false}>
      <div className="bk-fields">
        {fields.map((f) => (
          <Field key={f.name} f={f} value={values[f.name]} onChange={set} />
        ))}
      </div>

      <div className="bk-form-foot">
        <button type="submit" className="bk-submit">
          {cta} <ArrowRight size={16} />
        </button>
        <span className="bk-form-note">{reply}</span>
      </div>
    </form>
  );

  /* ---------------------------------------------------------------
     CARD — the head above a single panel, and inside it the aside on a
     solid accent ground beside the form. Opt in with variant="card";
     the column layout below stays the default, because the other two
     product pages use it and neither asked for this.
     --------------------------------------------------------------- */
  if (variant === 'card') {
    return (
      <section className={`bk-contact bk-contact-card ${tone} ${className}`} id={id}>
        <div className="bk-shell">
          <Reveal className="bk-card" y={22}>
            <aside className="bk-card-side">
              <span className="bk-card-orb" aria-hidden="true" />
              <h3>{panel.title}</h3>
              {panel.note && <p>{panel.note}</p>}
              {rows && <div className="bk-card-rows">{rows}</div>}
            </aside>

            <div className="bk-card-main">{body}</div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={`bk-contact ${tone} ${className}`} id={id}>
      <div className="bk-shell bk-contact-in">
        <div className="bk-contact-copy">
          {head}

          {rows && (
            <Reveal delay={0.24} y={14}>
              <div className="bk-contact-aside">{rows}</div>
            </Reveal>
          )}
        </div>

        <Reveal className="bk-form-wrap" delay={0.1} y={22}>{body}</Reveal>
      </div>
    </section>
  );
};
