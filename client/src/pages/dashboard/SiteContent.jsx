import React, { useState, useEffect } from 'react';
import {
  FaPalette,
  FaBuilding,
  FaInfoCircle,
  FaFileAlt,
  FaImage,
  FaSave,
  FaUndo,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlus,
  FaTrash,
  FaShareAlt,
  FaUserShield,
  FaSpinner,
  FaEnvelope
} from 'react-icons/fa';
import { useContent, DEFAULT_CONTENT } from '../../contexts/ContentContext';
import './SiteContent.css';

const Section = ({ title, icon, desc, children }) => (
  <section className="site-content-section">
    <div className="section-heading">
      <span className="section-heading-icon">{icon}</span>
      <div>
        <h3 className="section-heading-title">{title}</h3>
        {desc && <p className="section-heading-desc">{desc}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children }) => (
  <div className="sc-field">
    <label className="sc-label">{label}</label>
    {children}
    {hint && <span className="sc-hint">{hint}</span>}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    className="sc-input"
    type="text"
    value={value || ''}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

const TextArea = ({ value, onChange, rows = 5, placeholder }) => (
  <textarea
    className="sc-input sc-textarea"
    rows={rows}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  ></textarea>
);

const ColorInput = ({ value, onChange }) => (
  <div className="sc-color-row">
    <input type="color" className="sc-color" value={value} onChange={(e) => onChange(e.target.value)} />
    <TextInput value={value} onChange={onChange} placeholder="#5A3825" />
  </div>
);

const SiteContent = () => {
  const { content, updateContent, lastSaved, saving } = useContent();
  const [draft, setDraft] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  useEffect(() => {
    setDraft(content);
    setInitialSnapshot(JSON.stringify(content));
  }, []);

  useEffect(() => {
    if (draft && initialSnapshot) {
      setHasChanges(JSON.stringify(draft) !== initialSnapshot);
    }
  }, [draft, initialSnapshot]);

  const set = (path, value) => {
    setDraft(prev => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setArrayItem = (path, index, field, value) => {
    setDraft(prev => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = [...cur[keys[keys.length - 1]]];
      cur[keys[keys.length - 1]][index] = {
        ...cur[keys[keys.length - 1]][index],
        [field]: value,
      };
      return next;
    });
  };

  const addArrayItem = (path, newItem) => {
    setDraft(prev => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = [...cur[keys[keys.length - 1]], newItem];
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setDraft(prev => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = cur[keys[keys.length - 1]].filter((_, i) => i !== index);
      return next;
    });
  };

  if (!draft) {
    return (
      <div className="site-content-loading">
        <FaSpinner className="spin" />
        <p>Loading site content...</p>
      </div>
    );
  }

  const handleSave = () => {
    updateContent(draft);
    setInitialSnapshot(JSON.stringify(draft));
    setHasChanges(false);
    setSaveStatus({ type: 'success', message: 'Site content published. Changes are now live across the site.' });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3500);
  };

  const handleReset = () => {
    const snapshot = initialSnapshot ? JSON.parse(initialSnapshot) : content;
    setDraft(snapshot);
    setSaveStatus({ type: '', message: '' });
  };

  const handleResetAll = () => {
    if (!window.confirm('Reset ALL site content back to the default 2PJ Reality branding? This cannot be undone locally.')) return;
    setDraft(DEFAULT_CONTENT);
    setSaveStatus({ type: 'success', message: 'Draft reset to defaults. Click Publish to apply.' });
  };

  return (
    <div className="site-content-page">
      <header className="site-content-header">
        <div>
          <h1><FaShareAlt className="header-icon" /> Site Content</h1>
          <p className="header-description">
            Manage every piece of text, branding and formatting shown on your public site. Changes publish instantly across all pages.
          </p>
        </div>
        <div className="publish-hint">
          Site-wide visibility
        </div>
      </header>

      <div className="site-content-layout">
        <div className="site-content-main">
          {/* Brand */}
          <Section
            title="Brand Identity"
            icon={<FaBuilding />}
            desc="Your company name, logo and tagline shown in the navbar, footer and pages."
          >
            <div className="sc-grid sc-grid-2">
              <Field label="Company Name">
                <TextInput value={draft.brand.name} onChange={(v) => set('brand.name', v)} placeholder="2PJ Reality" />
              </Field>
              <Field label="Logo Text">
                <TextInput value={draft.brand.logoText} onChange={(v) => set('brand.logoText', v)} placeholder="2PJ Reality" />
              </Field>
            </div>
            <div className="sc-grid sc-grid-2">
              <Field label="Logo Icon (emoji or character)">
                <TextInput value={draft.brand.logoIcon} onChange={(v) => set('brand.logoIcon', v)} placeholder="🏠" />
              </Field>
              <Field label="Logo Image URL (optional — overrides icon)">
                <TextInput value={draft.brand.logoImage} onChange={(v) => set('brand.logoImage', v)} placeholder="https://.../logo.png" />
              </Field>
            </div>
            <Field label="Tagline">
              <TextInput value={draft.brand.tagline} onChange={(v) => set('brand.tagline', v)} placeholder="Rooted in Culture. Driven by Trust." />
            </Field>
            <div className="sc-preview">
              <span className="sc-preview-label">Live preview</span>
              <div className="sc-preview-brand">
                {draft.brand.logoImage ? (
                  <img src={draft.brand.logoImage} alt="logo" />
                ) : (
                  <span className="sc-preview-icon">{draft.brand.logoIcon}</span>
                )}
                <span className="sc-preview-name">{draft.brand.logoText || 'Your Brand'}</span>
              </div>
              <p className="sc-preview-tagline">{draft.brand.tagline || 'Your tagline'}</p>
            </div>
          </Section>

          {/* Hero */}
          <Section
            title="Homepage Hero"
            icon={<FaImage />}
            desc="The headline banner shown on your homepage."
          >
            <Field label="Headline">
              <TextInput value={draft.hero.title} onChange={(v) => set('hero.title', v)} />
            </Field>
            <Field label="Subheadline">
              <TextArea value={draft.hero.subtitle} onChange={(v) => set('hero.subtitle', v)} rows={2} />
            </Field>
            <div className="sc-grid sc-grid-2">
              <Field label="Primary Button">
                <TextInput value={draft.hero.primaryCta} onChange={(v) => set('hero.primaryCta', v)} />
              </Field>
              <Field label="Primary Button Link">
                <TextInput value={draft.hero.primaryCtaLink} onChange={(v) => set('hero.primaryCtaLink', v)} />
              </Field>
            </div>
            <div className="sc-grid sc-grid-2">
              <Field label="Secondary Button">
                <TextInput value={draft.hero.secondaryCta} onChange={(v) => set('hero.secondaryCta', v)} />
              </Field>
              <Field label="Secondary Button Link">
                <TextInput value={draft.hero.secondaryCtaLink} onChange={(v) => set('hero.secondaryCtaLink', v)} />
              </Field>
            </div>
            <Field label="Hero Background Image URL" hint="A high-quality image (ideally 1600px+ wide)">
              <TextInput value={draft.hero.image} onChange={(v) => set('hero.image', v)} />
            </Field>
          </Section>

          {/* About */}
          <Section
            title="About Page"
            icon={<FaInfoCircle />}
            desc="Everything the client needs to know about your business — story, values, team and contact."
          >
            <div className="sc-grid sc-grid-2">
              <Field label="About Page Title">
                <TextInput value={draft.about.heroTitle} onChange={(v) => set('about.heroTitle', v)} />
              </Field>
              <Field label="Story Section Headline">
                <TextInput value={draft.about.headline} onChange={(v) => set('about.headline', v)} />
              </Field>
            </div>

            <Field label="Story Paragraphs (one per line)">
              <TextArea
                value={draft.about.story.join('\n')}
                onChange={(v) => set('about.story', v.split('\n'))}
                rows={5}
              />
            </Field>

            <div className="sc-subheading">Values</div>
            {draft.about.valueCards.map((card, i) => (
              <div key={i} className="sc-array-row">
                <div className="sc-array-cell">
                  <label className="sc-label">Title</label>
                  <TextInput value={card.title} onChange={(v) => setArrayItem('about.valueCards', i, 'title', v)} />
                </div>
                <div className="sc-array-cell">
                  <label className="sc-label">Description</label>
                  <TextInput value={card.text} onChange={(v) => setArrayItem('about.valueCards', i, 'text', v)} />
                </div>
                <button className="sc-icon-btn" type="button" onClick={() => removeArrayItem('about.valueCards', i)} aria-label="Remove">
                  <FaTrash />
                </button>
              </div>
            ))}
            <button className="sc-add-btn" type="button" onClick={() => addArrayItem('about.valueCards', { icon: 'building', title: 'New Value', text: 'Describe this value.' })}>
              <FaPlus /> Add Value
            </button>

            <div className="sc-subheading">Team</div>
            {draft.about.team.map((member, i) => (
              <div key={i} className="sc-array-row sc-array-row-3">
                <div className="sc-array-cell">
                  <label className="sc-label">Name</label>
                  <TextInput value={member.name} onChange={(v) => setArrayItem('about.team', i, 'name', v)} />
                </div>
                <div className="sc-array-cell">
                  <label className="sc-label">Role</label>
                  <TextInput value={member.role} onChange={(v) => setArrayItem('about.team', i, 'role', v)} />
                </div>
                <div className="sc-array-cell">
                  <label className="sc-label">Photo URL</label>
                  <TextInput value={member.image} onChange={(v) => setArrayItem('about.team', i, 'image', v)} />
                </div>
                <button className="sc-icon-btn" type="button" onClick={() => removeArrayItem('about.team', i)} aria-label="Remove">
                  <FaTrash />
                </button>
              </div>
            ))}
            <button className="sc-add-btn" type="button" onClick={() => addArrayItem('about.team', { name: 'New Member', role: 'Your Role', image: '' })}>
              <FaPlus /> Add Team Member
            </button>

            <div className="sc-subheading">Contact Details</div>
            <div className="sc-grid sc-grid-3">
              <Field label="Email">
                <TextInput value={draft.about.contact.email} onChange={(v) => set('about.contact.email', v)} />
              </Field>
              <Field label="Phone">
                <TextInput value={draft.about.contact.phone} onChange={(v) => set('about.contact.phone', v)} />
              </Field>
              <Field label="Location">
                <TextInput value={draft.about.contact.location} onChange={(v) => set('about.contact.location', v)} />
              </Field>
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact & Footer" icon={<FaEnvelope />} desc="Contact details shown in the footer and contact sections.">
            <div className="sc-grid sc-grid-3">
              <Field label="Footer Email">
                <TextInput value={draft.footer.email} onChange={(v) => set('footer.email', v)} />
              </Field>
              <Field label="Footer Phone">
                <TextInput value={draft.footer.phone} onChange={(v) => set('footer.phone', v)} />
              </Field>
              <Field label="Footer Location">
                <TextInput value={draft.footer.location} onChange={(v) => set('footer.location', v)} />
              </Field>
            </div>
            <Field label="Footer About Text">
              <TextArea value={draft.footer.about} onChange={(v) => set('footer.about', v)} rows={4} />
            </Field>
          </Section>

          {/* Theme */}
          <Section
            title="Color Scheme"
            icon={<FaPalette />}
            desc="The primary, accent and background colors used across the whole site for buttons, cards and highlights."
          >
            <div className="sc-grid sc-grid-2">
              <Field label="Primary (buttons / headline)">
                <ColorInput value={draft.theme.primary} onChange={(v) => set('theme.primary', v)} />
              </Field>
              <Field label="Primary Dark (hover)">
                <ColorInput value={draft.theme.primaryDark} onChange={(v) => set('theme.primaryDark', v)} />
              </Field>
              <Field label="Accent (gold highlights)">
                <ColorInput value={draft.theme.accent} onChange={(v) => set('theme.accent', v)} />
              </Field>
              <Field label="Background (cream)">
                <ColorInput value={draft.theme.background} onChange={(v) => set('theme.background', v)} />
              </Field>
            </div>
            <div className="sc-swatches">
              <span className="swatch" style={{ background: draft.theme.primary }} title={draft.theme.primary}></span>
              <span className="swatch" style={{ background: draft.theme.primaryDark }} title={draft.theme.primaryDark}></span>
              <span className="swatch" style={{ background: draft.theme.accent }} title={draft.theme.accent}></span>
              <span className="swatch" style={{ background: draft.theme.background, border: '1px solid #e5e7eb' }} title={draft.theme.background}></span>
            </div>
          </Section>
        </div>

        {/* Sticky actions */}
        <div className="site-content-pane">
          <div className="pane-card">
            <h4 className="pane-title">Publish Changes</h4>
            <p className="pane-desc">
              Your edits appear instantly across the site. Use the buttons below to publish, discard, or reset everything to defaults.
            </p>

            {saveStatus.message && (
              <div className={`save-status ${saveStatus.type}`}>
                {saveStatus.type === 'success' ? (
                  <FaCheckCircle className="status-icon" />
                ) : (
                  <FaExclamationCircle className="status-icon" />
                )}
                <span>{saveStatus.message}</span>
              </div>
            )}

            {lastSaved && (
              <p className="last-saved">Last published: {lastSaved.toLocaleTimeString()}</p>
            )}

            <button className="pane-btn pane-btn-primary" onClick={handleSave} disabled={!hasChanges || saving}>
              {saving ? (
                <><FaSpinner className="spin" /> Publishing...</>
              ) : (
                <><FaSave /> Publish Changes</>
              )}
            </button>
            <button className="pane-btn pane-btn-secondary" onClick={handleReset} disabled={!hasChanges}>
              <FaUndo /> Discard Draft
            </button>
            <button className="pane-btn pane-btn-danger" onClick={handleResetAll}>
              Reset to Defaults
            </button>
          </div>

          <div className="pane-card pane-card-muted">
            <h4 className="pane-title"><FaUserShield className="pane-icon" /> How it works</h4>
            <p className="pane-desc">
              These settings are stored locally in your browser for instant previewing, and also wire to the backend content
              API so changes can persist for all visitors when the server is running. Only admins can edit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteContent;