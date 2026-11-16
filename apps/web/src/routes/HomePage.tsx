import { useEffect, useState } from 'react';

type IconName =
  'calendar' | 'sparkles' | 'guests' | 'celebrate' | 'venue' | 'vendor' | 'invite' | 'budget';

const iconPaths: Record<IconName, string> = {
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Zm2 10h3m-3 4h6',
  sparkles:
    'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 11 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 2l.7 1.3L7 4l-1.3.7L5 6l-.7-1.3L3 4l1.3-.7L5 2Z',
  guests:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7.8a4 4 0 0 1 0 7.6m2 4.2a4 4 0 0 1 3 3.9V21',
  celebrate:
    'M8 21h8m-4-4v4m-8-9a8 8 0 1 1 16 0c0 2-1.5 3.5-2.5 5h-11C5.5 15.5 4 14 4 12Zm4-7L6 3m10 2 2-2M4 9H2m20 0h-2',
  venue: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M8 10h.01M16 10h.01',
  vendor: 'M3 21h18M5 21V9l7-6 7 6v12m-9 0v-7h4v7m-7-9h.01M16 12h.01',
  invite: 'M4 5h16v14H4zM4 7l8 6 8-6m-4 8 3 3m0-3-3 3',
  budget: 'M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
};

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function LocalImage({
  alt,
  className,
  priority = false,
  src,
}: {
  alt: string;
  className: string;
  priority?: boolean;
  src: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div aria-label={alt} className={`${className} image-fallback`} role="img">
        <span>Image preview unavailable</span>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      src={src}
    />
  );
}

const steps: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'calendar',
    title: 'Create Your Wedding',
    description: 'Bring your dates, traditions, and important details into one shared workspace.',
  },
  {
    icon: 'sparkles',
    title: 'Plan Your Events',
    description: 'Set dates and details for every ceremony and celebration.',
  },
  {
    icon: 'guests',
    title: 'Manage Everything',
    description: 'Bring your guests, venues, vendors, and plans together.',
  },
  {
    icon: 'celebrate',
    title: 'Celebrate Together',
    description: 'Feel present for the moments you worked together to create.',
  },
];

const features: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'calendar',
    title: 'Wedding Management',
    description: 'Keep your wedding timeline, rituals, and planning notes together.',
  },
  {
    icon: 'guests',
    title: 'Guest Management',
    description: 'Organize guests and groups, then keep track of responses.',
  },
  {
    icon: 'invite',
    title: 'Digital Invitations',
    description: 'Share a thoughtful invitation with the details guests need.',
  },
  {
    icon: 'venue',
    title: 'Venue Discovery',
    description: 'Explore places for each part of your multi-day celebration.',
  },
  {
    icon: 'vendor',
    title: 'Vendor Discovery',
    description: 'Find wedding professionals and keep enquiries organized.',
  },
  {
    icon: 'budget',
    title: 'Budget Management',
    description: 'Keep an eye on estimates and expenses as plans come together.',
  },
];

const inspirations = [
  {
    title: 'Sunlit Marigold Courtyard',
    category: 'Haldi',
    city: 'Pune, Maharashtra',
    image: '/images/haldi-ceremony.jpg',
  },
  {
    title: 'Auspicious Royal Mandap',
    category: 'Mandap',
    city: 'Udaipur, Rajasthan',
    image: '/images/royal-mandap.jpg',
  },
  {
    title: 'Intricate Bridal Mehendi',
    category: 'Mehendi',
    city: 'Mumbai, Maharashtra',
    image: '/images/mehendi-celebration.jpg',
  },
  {
    title: 'A Celebration in Bloom',
    category: 'Floral Decorations',
    city: 'Nashik, Maharashtra',
    image: '/images/hero-mandap.jpg',
  },
  {
    title: 'A Promise for Always',
    category: 'Wedding Photography',
    city: 'Nagpur, Maharashtra',
    image: '/images/wedding-couple.jpg',
  },
  {
    title: 'Crimson and Gold',
    category: 'Wedding Decorations',
    city: 'Pune, Maharashtra',
    image: '/images/royal-mandap.jpg',
  },
];

const filters = [
  'All inspirations',
  'Haldi',
  'Mandap',
  'Mehendi',
  'Floral Decorations',
  'Wedding Photography',
  'Wedding Decorations',
];

const listings = [
  {
    category: 'Venues',
    title: 'Sample Heritage Venue',
    location: 'Pune, Maharashtra',
    detail: 'Demonstration venue preview',
    service: 'Large celebrations · Multiple event spaces',
    image: '/images/royal-mandap.jpg',
  },
  {
    category: 'Photographers',
    title: 'Sample Wedding Photographer',
    location: 'Mumbai, Maharashtra',
    detail: 'Demonstration listing preview',
    service: 'Wedding photography · Candid and ceremony coverage',
    image: '/images/wedding-couple.jpg',
  },
  {
    category: 'Decorators',
    title: 'Sample Wedding Decorator',
    location: 'Nashik, Maharashtra',
    detail: 'Demonstration listing preview',
    service: 'Mandaps · Floral and ceremony decor',
    image: '/images/royal-mandap.jpg',
  },
  {
    category: 'Caterers',
    title: 'Sample Wedding Caterer',
    location: 'Nagpur, Maharashtra',
    detail: 'Demonstration listing preview',
    service: 'Celebration menus · Regional cuisines',
    image: '/images/catering-preview.jpg',
  },
  {
    category: 'Mehendi Artists',
    title: 'Sample Mehendi Artist',
    location: 'Pune, Maharashtra',
    detail: 'Demonstration listing preview',
    service: 'Bridal mehendi · Family designs',
    image: '/images/mehendi-celebration.jpg',
  },
  {
    category: 'Event Planners',
    title: 'Sample Wedding Event Planner',
    location: 'Kolhapur, Maharashtra',
    detail: 'Demonstration listing preview',
    service: 'Multi-day celebration coordination',
    image: '/images/hero-mandap.jpg',
  },
];

const listingCategories = [
  'Venues',
  'Photographers',
  'Decorators',
  'Caterers',
  'Mehendi Artists',
  'Event Planners',
];

const invitationThemes = [
  {
    eyebrow: 'Royal',
    title: 'Rajasthani Heritage',
    couple: 'Aditi & Siddharth',
    date: 'December 14',
    style: 'royal',
  },
  {
    eyebrow: 'Traditional',
    title: 'Marigold & Lotus',
    couple: 'Pooja & Rohan',
    date: 'November 28',
    style: 'marigold',
  },
  {
    eyebrow: 'Floral',
    title: 'Botanical Monogram',
    couple: 'Kavya & Vikram',
    date: 'January 18',
    style: 'botanical',
  },
  {
    eyebrow: 'Minimal',
    title: 'Gold Foil Elegance',
    couple: 'Meera & Arjun',
    date: 'February 22',
    style: 'minimal',
  },
  {
    eyebrow: 'Modern',
    title: 'Contemporary Celebration',
    couple: 'Riya & Aditya',
    date: 'March 08',
    style: 'modern',
  },
];

function Brand() {
  return (
    <a className="brand-lockup" href="#home" aria-label="Make My Marriage home">
      <span className="brand-mark" aria-hidden="true">
        <span></span>
      </span>
      <span className="brand-name">Make My Marriage</span>
    </a>
  );
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [activeFilter, setActiveFilter] = useState('All inspirations');
  const [activeListing, setActiveListing] = useState('All categories');
  const [previewTheme, setPreviewTheme] = useState<(typeof invitationThemes)[number] | null>(null);
  const [selectedListing, setSelectedListing] = useState<(typeof listings)[number] | null>(null);

  const visibleInspirations =
    activeFilter === 'All inspirations'
      ? inspirations
      : inspirations.filter((item) => item.category === activeFilter);
  const visibleListings =
    activeListing === 'All categories'
      ? listings
      : listings.filter((item) => item.category === activeListing);

  const closeMenu = (label?: string) => {
    setMenuOpen(false);
    if (label) setActiveNav(label);
  };

  useEffect(() => {
    if (!previewTheme && !selectedListing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewTheme(null);
        setSelectedListing(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewTheme, selectedListing]);

  return (
    <div className="landing-page" id="home">
      <header className="landing-header">
        <div className="nav-inner">
          <Brand />
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="site-navigation"
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
          </button>
          <nav
            aria-label="Main navigation"
            className={`main-nav${menuOpen ? ' is-open' : ''}`}
            id="site-navigation"
          >
            <a
              aria-current={activeNav === 'Home' ? 'page' : undefined}
              className={`nav-link${activeNav === 'Home' ? ' is-current' : ''}`}
              href="#home"
              onClick={() => closeMenu('Home')}
            >
              Home
            </a>
            <a
              aria-current={activeNav === 'How it works' ? 'page' : undefined}
              className={`nav-link${activeNav === 'How it works' ? ' is-current' : ''}`}
              href="#how-it-works"
              onClick={() => closeMenu('How it works')}
            >
              How it works
            </a>
            <a
              aria-current={activeNav === 'Features' ? 'page' : undefined}
              className={`nav-link${activeNav === 'Features' ? ' is-current' : ''}`}
              href="#features"
              onClick={() => closeMenu('Features')}
            >
              Features
            </a>
            <a
              aria-current={activeNav === 'Venues & vendors' ? 'page' : undefined}
              className={`nav-link${activeNav === 'Venues & vendors' ? ' is-current' : ''}`}
              href="#venues-and-vendors"
              onClick={() => closeMenu('Venues & vendors')}
            >
              Venues & vendors
            </a>
          </nav>
          <div className="nav-actions">
            <details className="language-menu">
              <summary aria-label="Select language" className="language-note">
                English <span aria-hidden="true">v</span>
              </summary>
              <div aria-label="Language options" className="language-options">
                <span aria-current="true">English (selected)</span>
                <span>Hindi (coming soon)</span>
                <span>Marathi (coming soon)</span>
              </div>
            </details>
            <a className="login-link" href="/login">
              Log in
            </a>
            <a className="button button-small button-primary" href="#start-planning">
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section aria-labelledby="hero-title" className="hero-section">
          <div className="hero-glow hero-glow-left" />
          <div className="hero-glow hero-glow-right" />
          <div className="hero-inner page-container">
            <div className="hero-copy">
              <p className="hero-kicker">
                <span className="kicker-sparkle"></span> Thoughtful planning for Indian weddings
              </p>
              <h1 id="hero-title">
                Your dream wedding,
                <br />
                <em>beautifully planned.</em>
              </h1>
              <p className="hero-description">
                Plan every celebration, manage your guests, discover venues and vendors, and bring
                your wedding moments together in one place.
              </p>
              <div className="hero-buttons">
                <a className="button button-primary" href="#start-planning">
                  Start planning <span aria-hidden="true"></span>
                </a>
                <a className="button button-soft" href="#venues-and-vendors">
                  <Icon name="venue" /> Explore venues & vendors
                </a>
              </div>
              <div className="hero-assurance">
                <span className="assurance-seal">
                  <Icon name="sparkles" />
                </span>
                <span>Made for multi-day celebrations</span>
                <span className="assurance-dot"></span>
                <span>English · Hindi · Marathi</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <LocalImage
                  alt="A warmly lit Indian wedding mandap decorated with marigold flowers"
                  className="hero-image"
                  priority
                  src="/images/hero-mandap.jpg"
                />
                <div className="hero-image-wash" />
                <div className="hero-image-caption">
                  <span className="caption-kicker">A celebration made yours</span>
                  <strong>Every ritual. Every guest. Every moment.</strong>
                </div>
              </div>
              <div className="floating-note floating-note-top">
                <span className="note-icon note-icon-pink">
                  <Icon name="calendar" />
                </span>
                <span>
                  <strong>Your days, beautifully planned</strong>
                  <small>Events & celebrations</small>
                </span>
              </div>
              <div className="floating-note floating-note-bottom">
                <span className="note-icon note-icon-gold">
                  <Icon name="guests" />
                </span>
                <span>
                  <strong>Keep everyone in the loop</strong>
                  <small>Family, friends & guests</small>
                </span>
              </div>
            </div>
          </div>
          <div className="hero-bottom-rule" />
        </section>

        <section aria-labelledby="how-title" className="how-section section-pad" id="how-it-works">
          <div className="page-container">
            <div className="section-heading section-heading-centered">
              <p className="section-eyebrow">
                <span /> Simple, joyful planning <span />
              </p>
              <h2 id="how-title">How Make My Marriage works</h2>
              <p>Four gentle steps to bring all the moving parts of your celebration together.</p>
            </div>
            <div className="steps-grid">
              {steps.map((step, index) => (
                <article className="step-card" key={step.title}>
                  <div className={`step-icon tone-${index + 1}`}>
                    <Icon name={step.icon} />
                    <span className="step-number">{index + 1}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="features-title"
          className="features-section section-pad"
          id="features"
        >
          <div className="page-container">
            <div className="section-heading split-heading">
              <div>
                <p className="section-eyebrow eyebrow-pink">
                  Made for the grandeur of Indian weddings
                </p>
                <h2 id="features-title">
                  Everything your celebration
                  <br className="desktop-break" /> needs, thoughtfully together.
                </h2>
              </div>
              <p>
                From the first event on your calendar to the last guest on your list, make room for
                a calmer way to plan.
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <article className="feature-card" key={feature.title}>
                  <div className={`feature-icon feature-tone-${index + 1}`}>
                    <Icon name={feature.icon} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a className="learn-link" href="#start-planning">
                    Discover more <span aria-hidden="true"></span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="inspiration-title"
          className="inspiration-section section-pad"
          id="inspiration"
        >
          <div className="page-container">
            <div className="inspiration-heading">
              <div>
                <p className="section-eyebrow eyebrow-gold">Curated festive aesthetics</p>
                <h2 id="inspiration-title">
                  A little inspiration
                  <br className="desktop-break" /> for your big moments.
                </h2>
                <p>
                  Explore colors, rituals, and details to make each celebration feel like yours.
                </p>
              </div>
              <div aria-label="Filter inspiration by ceremony" className="filter-list" role="group">
                {filters.map((filter) => (
                  <button
                    aria-pressed={activeFilter === filter}
                    className={`filter-chip${activeFilter === filter ? ' is-active' : ''}`}
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="inspiration-grid">
              {visibleInspirations.map((item) => (
                <article className="inspiration-card" key={item.title}>
                  <LocalImage alt={item.title} className="inspiration-image" src={item.image} />
                  <div className="inspiration-overlay" />
                  <span className="inspiration-tag">{item.category}</span>
                  <div className="inspiration-card-copy">
                    <h3>{item.title}</h3>
                    <p>{item.city}</p>
                  </div>
                  <span aria-hidden="true" className="heart-mark"></span>
                </article>
              ))}
            </div>
            <a className="explore-link" href="#venues-and-vendors">
              Find inspiration for your celebration <span aria-hidden="true"></span>
            </a>
          </div>
        </section>

        <section
          aria-labelledby="directory-title"
          className="directory-section section-pad"
          id="venues-and-vendors"
        >
          <div className="page-container">
            <div className="section-heading section-heading-centered directory-heading">
              <p className="section-eyebrow eyebrow-pink">Your wedding, your way</p>
              <h2 id="directory-title">
                Meet the places and people
                <br className="desktop-break" /> behind the celebration.
              </h2>
              <p>Explore wedding venues and creative professionals for your celebration.</p>
            </div>
            <div aria-label="Choose listing type" className="directory-tabs" role="group">
              {['All categories', ...listingCategories].map((category) => (
                <button
                  aria-pressed={activeListing === category}
                  className={`directory-tab${activeListing === category ? ' is-active' : ''}`}
                  key={category}
                  onClick={() => setActiveListing(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="demo-listing-note">
              Demonstration listings for layout preview. These are not real or verified businesses.
            </p>
            <div className="listing-grid" id="listing-grid">
              {visibleListings.map((listing) => (
                <article className="listing-card" key={listing.title}>
                  <div className="listing-image-wrap">
                    <LocalImage
                      alt={listing.category}
                      className="listing-image"
                      src={listing.image}
                    />
                    <span>Demo listing</span>
                  </div>
                  <div className="listing-card-body">
                    <h3>{listing.title}</h3>
                    <p className="listing-location">{listing.location}</p>
                    <p className="listing-detail">{listing.detail}</p>
                    <p className="listing-service">{listing.service}</p>
                    <button
                      className="listing-action"
                      onClick={() => setSelectedListing(listing)}
                      type="button"
                    >
                      Explore details <span aria-hidden="true"></span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <a className="button button-primary directory-cta" href="#listing-grid">
              Explore All Venues & Vendors <span aria-hidden="true"></span>
            </a>
          </div>
        </section>

        <section
          aria-labelledby="invitation-title"
          className="invitations-section section-pad"
          id="invitations"
        >
          <div className="page-container">
            <div className="invitation-heading">
              <div>
                <p className="section-eyebrow eyebrow-gold">A lovely way to say come celebrate</p>
                <h2 id="invitation-title">
                  Digital invitations,
                  <br className="desktop-break" /> full of feeling.
                </h2>
                <p>Find a style that feels right and share the joy with the people who matter.</p>
              </div>
              <a className="text-arrow-link" href="#start-planning">
                Explore invitation styles <span aria-hidden="true"></span>
              </a>
            </div>
            <div className="invitation-grid">
              {invitationThemes.map((theme) => (
                <article className="invitation-card" key={theme.title}>
                  <div className={`invitation-preview invitation-${theme.style}`}>
                    <span className="preview-flourish" aria-hidden="true"></span>
                    <span className="preview-label">With love & blessings</span>
                    <strong>{theme.couple}</strong>
                    <span className="preview-date">{theme.date}</span>
                    <span className="preview-place">Join us for the celebration</span>
                    <span
                      className="preview-flourish preview-flourish-bottom"
                      aria-hidden="true"
                    ></span>
                  </div>
                  <div className="invitation-card-copy">
                    <p>{theme.eyebrow}</p>
                    <h3>{theme.title}</h3>
                    <button
                      className="button button-outline"
                      onClick={() => setPreviewTheme(theme)}
                      type="button"
                    >
                      Preview style
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {previewTheme ? (
          <div
            aria-label={`${previewTheme.title} invitation preview`}
            aria-modal="true"
            className="invitation-modal"
            onClick={(event) => {
              if (event.target === event.currentTarget) setPreviewTheme(null);
            }}
            role="dialog"
          >
            <div className="invitation-modal-panel">
              <button
                aria-label="Close invitation preview"
                autoFocus
                className="invitation-modal-close"
                onClick={() => setPreviewTheme(null)}
                type="button"
              >
                Close
              </button>
              <div
                className={`invitation-preview invitation-${previewTheme.style} invitation-preview-large`}
              >
                <span className="preview-flourish" aria-hidden="true"></span>
                <span className="preview-label">With love & blessings</span>
                <strong>{previewTheme.couple}</strong>
                <span className="preview-date">{previewTheme.date}</span>
                <span className="preview-place">Join us for the celebration</span>
                <span
                  className="preview-flourish preview-flourish-bottom"
                  aria-hidden="true"
                ></span>
              </div>
              <p className="invitation-modal-category">{previewTheme.eyebrow} template preview</p>
              <h2>{previewTheme.title}</h2>
              <p>Pre-designed invitation preview. Editing and sharing are not available yet.</p>
            </div>
          </div>
        ) : null}

        {selectedListing ? (
          <div
            aria-label={`${selectedListing.category} sample listing details`}
            aria-modal="true"
            className="invitation-modal"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedListing(null);
            }}
            role="dialog"
          >
            <div className="invitation-modal-panel listing-modal-panel">
              <button
                aria-label="Close sample listing details"
                autoFocus
                className="invitation-modal-close"
                onClick={() => setSelectedListing(null)}
                type="button"
              >
                Close
              </button>
              <p className="invitation-modal-category">
                Demonstration {selectedListing.category.toLowerCase()} listing
              </p>
              <h2>{selectedListing.title}</h2>
              <p className="listing-modal-location">{selectedListing.location}</p>
              <p>{selectedListing.service}</p>
              <p>This is sample content for layout preview, not a real or verified business.</p>
            </div>
          </div>
        ) : null}

        <section aria-labelledby="cta-title" className="closing-section" id="start-planning">
          <div className="closing-ornament" aria-hidden="true"></div>
          <p className="section-eyebrow eyebrow-gold">Begin with grace & auspicious joy</p>
          <h2 id="cta-title">Your Wedding Journey Starts Here.</h2>
          <p>Bring your wedding plans, guests, events and celebrations together in one place.</p>
          <a className="button button-primary button-large" href="/login">
            Start Planning for Free <span aria-hidden="true"></span>
          </a>
          <div className="closing-note">
            <span>Thoughtful planning</span>
            <i /> <span>Made for every tradition</span>
            <i /> <span>Made for togetherness</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="page-container footer-main">
          <div className="footer-brand-block">
            <Brand />
            <p className="footer-tagline">Celebrate every moment.</p>
            <p>Bringing wedding plans, people, and traditions together with a little more ease.</p>
            <span className="footer-motto"> Made for joyful celebrations </span>
          </div>
          <div className="footer-column">
            <h2>Quick links</h2>
            <a href="#home">Home</a>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#inspiration">Inspiration</a>
          </div>
          <div className="footer-column">
            <h2>Wedding services</h2>
            <a href="#venues-and-vendors">Venues</a>
            <a href="#venues-and-vendors">Photographers</a>
            <a href="#venues-and-vendors">Decorators</a>
            <a href="#venues-and-vendors">Caterers</a>
            <a href="#venues-and-vendors">Mehendi artists</a>
            <a href="#venues-and-vendors">Event planners</a>
            <a href="#invitations">Invitations</a>
          </div>
          <div className="footer-column">
            <h2>Contact & follow us</h2>
            <span>Contact details will be added before launch.</span>
            <div className="footer-legal" aria-label="Policies">
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
        <div className="page-container footer-bottom">
          <span> {new Date().getFullYear()} Make My Marriage</span>
          <span>One wedding. Every event. Every guest.</span>
        </div>
      </footer>
    </div>
  );
}
