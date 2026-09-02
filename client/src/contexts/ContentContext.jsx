import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken } from '../utils/auth';

const STORAGE_KEY = 'pj_site_content_v1';

export const DEFAULT_CONTENT = {
  brand: {
    name: '2PJ Reality',
    shortName: '2PJ',
    logoText: '2PJ Reality',
    logoIcon: '🏠',
    logoImage: '',
    tagline: 'Rooted in Culture. Driven by Trust.',
  },
  hero: {
    title: 'Discover Your Dream Property',
    subtitle: 'Luxury homes and apartments in the most desirable locations across Ghana.',
    primaryCta: 'Explore Properties',
    primaryCtaLink: '/properties',
    secondaryCta: 'Learn More',
    secondaryCtaLink: '/about',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
  },
  about: {
    heroTitle: 'About 2PJ Reality',
    headline: 'Our Story',
    story: [
      'Rooted in culture and driven by trust, 2PJ Reality has grown into a trusted name in real estate and hospitality. Our mission is to connect people with their dream properties while celebrating the rich cultural heritage of the African continent.',
      'What started as a small team with a shared vision has matured into a full-service platform known for integrity, professionalism, and a deep understanding of local markets. We build communities, not just buildings.',
    ],
    valueCards: [
      { icon: 'building', title: 'Integrity', text: 'Transparency and honesty in all our dealings, building lasting trust with clients and partners.' },
      { icon: 'users', title: 'Community', text: 'Creating value for the communities we serve — not just our clients, but the people who live in them.' },
      { icon: 'handshake', title: 'Excellence', text: 'The highest standards in everything, from property selection to customer service.' },
      { icon: 'globe', title: 'Cultural Pride', text: 'We celebrate and promote African culture through our work and partnerships.' },
    ],
    team: [
      { name: 'Aaron Ashong', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { name: 'Building Relationships', role: 'Hospitality & Sales', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { name: 'Trusted Advisors', role: 'Property Management', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    ],
    contact: {
      email: 'hello@2pjreality.com',
      phone: '+233 000 000 000',
      location: 'Accra, Ghana',
    },
  },
  footer: {
    about: '2PJ Reality is a full-service real estate and hospitality platform building communities across Ghana — rooted in culture, driven by trust.',
    email: 'hello@2pjreality.com',
    phone: '+233 000 000 000',
    location: 'Accra, Ghana',
  },
  theme: {
    primary: '#5A3825',
    primaryDark: '#4a2e1e',
    accent: '#DAA520',
    background: '#FAF8F4',
    ink: '#2E2E2E',
  },
};

const ContentContext = createContext(null);

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
};

const mergeContent = (base, override) => {
  if (!override || typeof override !== 'object') return base;
  const result = { ...base };
  for (const key of Object.keys(base)) {
    if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
      result[key] = mergeContent(base[key], override[key] && typeof override[key] === 'object' ? override[key] : {});
    } else if (override[key] !== undefined && override[key] !== null) {
      result[key] = override[key];
    }
  }
  return result;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load content on mount: backend first (if reachable), then localStorage fallback
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      let merged = DEFAULT_CONTENT;
      let triedBackend = false;

      try {
        const token = getToken() || '';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/content/`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          signal: controller.signal,
        });
        clearTimeout(timeout);
        triedBackend = true;
        if (res.ok) {
          const data = await res.json();
          merged = mergeContent(DEFAULT_CONTENT, data.content || data);
        }
      } catch (err) {
        triedBackend = true;
      }

      if (!isMounted) return;

      // localStorage override (local preview/hard-override persists on top)
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          merged = mergeContent(merged, JSON.parse(stored));
        }
      } catch (err) {
        // ignore corrupted storage
      }

      setContent(merged);
      setLoaded(true);
      if (!triedBackend && process.env.NODE_ENV !== 'production') {
        // noop - backend unavailable path handled above
      }
    };
    load();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateContent = useCallback((updater, options = {}) => {
    setContent(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const merged = mergeContent(prev, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        // storage may be full or unavailable
      }
      return merged;
    });
    setLastSaved(new Date());
  }, []);

  // Role-based ability to edit
  const canEdit = useCallback((user) => {
    return Boolean(user && (user.user_type === 'admin' || user.is_staff || user.is_superuser));
  }, []);

  const value = {
    content,
    loaded,
    saving,
    lastSaved,
    updateContent,
    canEdit,
    STORAGE_KEY,
    resetContent: useCallback(async () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        // ignore
      }
      setContent(DEFAULT_CONTENT);
      setLastSaved(new Date());
    }, []),
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export default ContentContext;