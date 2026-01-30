/**
 * Shreya Savant Portfolio
 * Enhanced JavaScript for animations and interactions
 */

// ============================================
// Reveal Animations with Intersection Observer
// ============================================
const initRevealAnimations = () => {
  const revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add small delay for staggered effect within grids
          const parent = entry.target.parentElement;
          if (parent && (parent.classList.contains('card-grid') ||
            parent.classList.contains('impact-grid') ||
            parent.classList.contains('skills-grid'))) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.08}s`;
          }

          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

// ============================================
// Active Navigation Link
// ============================================
const initActiveNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    // Remove existing active class first
    link.classList.remove('is-active');

    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
};

// ============================================
// Theme Toggle
// ============================================
const initThemeToggle = () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const storedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeToggle(themeToggle);

  // Initialize contribution graph color on page load
  updateContributionGraphColor(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeToggle(themeToggle);
  });
};

const updateThemeToggle = (toggle) => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  toggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`);

  // Update GitHub contribution graph color based on theme
  updateContributionGraphColor(currentTheme);
};

const updateContributionGraphColor = (theme) => {
  const contributionGraph = document.getElementById('gh-contribution-graph');
  if (!contributionGraph) return;

  const githubUsername = 'shreyasavant';
  // Use green for dark theme, darker green for light theme for better visibility
  const color = theme === 'light' ? '40c463' : '39d353';
  contributionGraph.src = `https://ghchart.rshah.org/${color}/${githubUsername}`;
};

// ============================================
// GitHub API Integration
// ============================================
const initGitHubIntegration = () => {
  const githubUsername = 'shreyasavant';
  const githubProfileUrl = `https://api.github.com/users/${githubUsername}`;
  const githubReposUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=8`;

  const elements = {
    name: document.getElementById('gh-name'),
    handle: document.getElementById('gh-handle'),
    bio: document.getElementById('gh-bio'),
    location: document.getElementById('gh-location'),
    followers: document.getElementById('gh-followers'),
    following: document.getElementById('gh-following'),
    reposCount: document.getElementById('gh-repos-count'),
    avatar: document.getElementById('gh-avatar'),
    profileLink: document.getElementById('gh-profile-link'),
    reposList: document.getElementById('gh-repos-list')
  };

  // Fetch profile data with caching
  if (elements.name || elements.reposList) {
    const cachedProfile = localStorage.getItem('gh_profile');
    const cacheTime = localStorage.getItem('gh_profile_time');

    if (cachedProfile && cacheTime && (Date.now() - cacheTime < 3600000)) {
      renderProfile(JSON.parse(cachedProfile), elements);
    } else {
      fetch(githubProfileUrl)
        .then((response) => {
          if (!response.ok) throw new Error('GitHub API error');
          return response.json();
        })
        .then((profile) => {
          localStorage.setItem('gh_profile', JSON.stringify(profile));
          localStorage.setItem('gh_profile_time', Date.now().toString());
          renderProfile(profile, elements);
        })
        .catch(() => {
          // Silently fail - fallback content is already in HTML
        });
    }
  }

  // Fetch repositories with caching
  if (elements.reposList) {
    const cachedRepos = localStorage.getItem('gh_repos');
    const reposCacheTime = localStorage.getItem('gh_repos_time');

    if (cachedRepos && reposCacheTime && (Date.now() - reposCacheTime < 3600000)) {
      renderRepos(JSON.parse(cachedRepos), elements);
    } else {
      fetch(githubReposUrl)
        .then((response) => {
          if (!response.ok) throw new Error('GitHub API error');
          return response.json();
        })
        .then((repos) => {
          localStorage.setItem('gh_repos', JSON.stringify(repos));
          localStorage.setItem('gh_repos_time', Date.now().toString());
          renderRepos(repos, elements);
        })
        .catch(() => {
          elements.reposList.innerHTML = '<p style="color: var(--text-tertiary);">Unable to load repositories.</p>';
        });
    }
  }
};

const renderProfile = (profile, elements) => {
  if (elements.name) elements.name.textContent = profile.name || 'Shreya Savant';
  if (elements.handle) elements.handle.textContent = `@${profile.login}`;
  if (elements.bio) elements.bio.textContent = profile.bio || 'AI researcher building reliable systems for energy infrastructure.';
  if (elements.location) elements.location.textContent = profile.location || 'Montreal, QC';
  if (elements.followers) elements.followers.textContent = profile.followers ?? '—';
  if (elements.following) elements.following.textContent = profile.following ?? '—';
  if (elements.reposCount) elements.reposCount.textContent = profile.public_repos ?? '—';
  if (elements.avatar && profile.avatar_url) elements.avatar.src = profile.avatar_url;
  if (elements.profileLink && profile.html_url) elements.profileLink.href = profile.html_url;
};

const renderRepos = (repos, elements) => {
  const filtered = repos
    .filter((repo) => !repo.fork)
    .slice(0, 6);

  if (filtered.length === 0) {
    elements.reposList.innerHTML = '<p style="color: var(--text-tertiary);">No public repositories found.</p>';
    return;
  }

  elements.reposList.innerHTML = '';

  filtered.forEach((repo, index) => {
    const card = document.createElement('article');
    card.className = 'repo-card reveal';
    card.style.transitionDelay = `${index * 0.08}s`;

    const description = repo.description
      ? (repo.description.length > 100
        ? repo.description.substring(0, 100) + '...'
        : repo.description)
      : 'No description provided.';

    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    card.innerHTML = `
      <div class="repo-header">
        <a class="repo-title" href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
        ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
      </div>
      <p class="repo-desc">${description}</p>
      <div class="repo-meta">
        <span>★ ${repo.stargazers_count}</span>
        <span>Updated ${updatedDate}</span>
      </div>
    `;

    elements.reposList.appendChild(card);

    // Trigger reveal animation after DOM insertion
    requestAnimationFrame(() => {
      card.classList.add('is-visible');
    });
  });
};

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// ============================================
// Form Enhancement
// ============================================
const initFormEnhancement = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', () => {
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }
  });

  // Add focus states for better UX
  const inputs = form.querySelectorAll('.input-field');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('is-focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('is-focused');
    });
  });
};

// ============================================
// Keyboard Navigation Enhancement
// ============================================
const initKeyboardNav = () => {
  // Add keyboard navigation for interactive cards
  document.querySelectorAll('.card, .impact-card, .repo-card').forEach((card) => {
    const link = card.querySelector('a');
    if (link) {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
};

// ============================================
// Gallery Shuffle on Page Load
// ============================================
const initGalleryShuffle = () => {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  if (items.length === 0) return;

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle and re-append items
  const shuffledItems = shuffleArray(items);
  shuffledItems.forEach((item) => {
    gallery.appendChild(item);
  });
};

// ============================================
// LightGallery Initialization
// ============================================
const initLightGallery = () => {
  // Initialize LightGallery on homepage photo gallery
  const photoGallery = document.querySelector('.photo-gallery');
  if (photoGallery && typeof lightGallery !== 'undefined') {
    // Add data-src attributes to gallery items for LightGallery
    photoGallery.querySelectorAll('.gallery-item').forEach((item) => {
      const img = item.querySelector('img');
      if (img) {
        item.setAttribute('data-src', img.src);
        item.setAttribute('data-sub-html', `<h4>${img.alt}</h4>`);
      }
    });

    lightGallery(photoGallery, {
      selector: '.gallery-item',
      speed: 400,
      plugins: [lgZoom, lgThumbnail],
      download: false,
      counter: true,
      zoom: true,
      scale: 1,
      thumbnail: true,
      animateThumb: true,
      zoomFromOrigin: true,
      allowMediaOverlap: true,
      toggleThumb: true
    });
  }

  // Initialize LightGallery on advocacy featured gallery
  const advocacyGallery = document.querySelector('.featured-advocacy-gallery');
  if (advocacyGallery && typeof lightGallery !== 'undefined') {
    // Add data-src to main image
    const mainImg = advocacyGallery.querySelector('.gallery-main');
    if (mainImg) {
      mainImg.setAttribute('data-src', mainImg.src);
      mainImg.setAttribute('data-sub-html', `<h4>${mainImg.alt}</h4>`);
    }

    // Add data-src to thumbnails
    advocacyGallery.querySelectorAll('.gallery-thumbnails img').forEach((img) => {
      const wrapper = document.createElement('a');
      wrapper.setAttribute('data-src', img.src);
      wrapper.setAttribute('data-sub-html', `<h4>${img.alt}</h4>`);
      wrapper.style.display = 'contents';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    });

    lightGallery(advocacyGallery, {
      selector: '.gallery-main, .gallery-thumbnails a',
      speed: 400,
      plugins: [lgZoom, lgThumbnail],
      download: false,
      counter: true,
      zoom: true,
      thumbnail: true,
      animateThumb: true,
      zoomFromOrigin: true,
      allowMediaOverlap: true,
      toggleThumb: true
    });
  }
};

// Advocacy thumbnail click to swap with main image
const initAdvocacyImageSwap = () => {
  const advocacyMainImg = document.querySelector('.featured-advocacy-gallery .gallery-main');
  const advocacyThumbnails = document.querySelectorAll('.featured-advocacy-gallery .gallery-thumbnails img');

  if (!advocacyMainImg || advocacyThumbnails.length === 0) return;

  advocacyThumbnails.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      // Prevent LightGallery from opening on single click
      e.stopPropagation();

      // Swap images
      const mainSrc = advocacyMainImg.src;
      const mainAlt = advocacyMainImg.alt;
      const mainDataSrc = advocacyMainImg.getAttribute('data-src');

      advocacyMainImg.src = thumb.src;
      advocacyMainImg.alt = thumb.alt;
      advocacyMainImg.setAttribute('data-src', thumb.src);

      thumb.src = mainSrc;
      thumb.alt = mainAlt;
      if (thumb.parentElement.tagName === 'A') {
        thumb.parentElement.setAttribute('data-src', mainSrc);
      }
    });
  });
};

// ============================================
// Lenis Smooth Scroll
// ============================================
let lenis = null;

const initLenis = () => {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false
  });

  // Connect Lenis to GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(500, 33);
  } else {
    // Fallback RAF loop if GSAP isn't loaded
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
};

// ============================================
// GSAP ScrollTrigger Animations
// ============================================
const initGSAPAnimations = () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero section entrance
  const heroElements = document.querySelectorAll('.personal-hero h1, .personal-hero .subtitle, .personal-hero .hero-links');
  if (heroElements.length) {
    gsap.from(heroElements, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Cards with staggered reveal on scroll
  const cardGrids = document.querySelectorAll('.card-grid, .impact-grid, .skills-grid, .quick-links-grid');
  cardGrids.forEach((grid) => {
    const cards = grid.querySelectorAll('.card, .impact-card, .quick-link-card, .skills-card');
    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  });

  // Section headers slide in
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Timeline items stagger
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    gsap.from(timelineItems, {
      scrollTrigger: {
        trigger: timelineItems[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  // Gallery items cascade
  const galleryItems = document.querySelectorAll('.photo-gallery .gallery-item');
  if (galleryItems.length) {
    gsap.fromTo(galleryItems,
      {
        y: 20,
        opacity: 0
      },
      {
        scrollTrigger: {
          trigger: '.photo-gallery',
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }

  // Publication items
  const pubItems = document.querySelectorAll('.publication-item');
  if (pubItems.length) {
    gsap.from(pubItems, {
      scrollTrigger: {
        trigger: pubItems[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }

  // Repo cards
  const repoCards = document.querySelectorAll('.repo-card');
  if (repoCards.length) {
    gsap.from(repoCards, {
      scrollTrigger: {
        trigger: repoCards[0]?.parentElement,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  // Contribution graph
  const contribGraph = document.querySelector('.contribution-graph-wrapper');
  if (contribGraph) {
    gsap.from(contribGraph, {
      scrollTrigger: {
        trigger: contribGraph,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  // Featured advocacy card
  const featuredAdvocacy = document.querySelector('.featured-advocacy');
  if (featuredAdvocacy) {
    gsap.from(featuredAdvocacy, {
      scrollTrigger: {
        trigger: featuredAdvocacy,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    });
  }

  // Parallax effect for hero image
  const heroImage = document.querySelector('.hero-card img, .personal-hero img');
  if (heroImage) {
    gsap.to(heroImage, {
      scrollTrigger: {
        trigger: heroImage,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: 30,
      ease: 'none'
    });
  }
};

// ============================================
// VanillaTilt for Cards
// ============================================
const initVanillaTilt = () => {
  if (typeof VanillaTilt === 'undefined') return;

  // Apply subtle tilt to cards
  const tiltElements = document.querySelectorAll('.card, .impact-card, .repo-card, .quick-link-card, .publication-item, .skills-card, .timeline-item');

  VanillaTilt.init(tiltElements, {
    max: 4,
    speed: 400,
    glare: true,
    'max-glare': 0.08,
    scale: 1.02,
    perspective: 1000
  });

  // Stronger tilt for featured items
  const featuredElements = document.querySelectorAll('.featured-advocacy, .hero-card');
  VanillaTilt.init(featuredElements, {
    max: 3,
    speed: 300,
    glare: true,
    'max-glare': 0.05,
    scale: 1.01,
    perspective: 1200
  });

  // Gallery items with playful tilt
  const galleryItems = document.querySelectorAll('.gallery-item');
  VanillaTilt.init(galleryItems, {
    max: 8,
    speed: 400,
    glare: false,
    scale: 1.03,
    perspective: 800
  });
};

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initGalleryShuffle(); // Shuffle gallery first
  initLenis(); // Smooth scrolling
  initGSAPAnimations(); // GSAP scroll animations
  initVanillaTilt(); // 3D tilt effects
  initRevealAnimations(); // Fallback reveal animations
  initActiveNavigation();
  initThemeToggle();
  initGitHubIntegration();
  initSmoothScroll();
  initFormEnhancement();
  initKeyboardNav();
  initAdvocacyImageSwap();
  initLightGallery();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations and Lenis when tab is hidden
    document.body.style.setProperty('--animation-play-state', 'paused');
    if (lenis) lenis.stop();
  } else {
    document.body.style.setProperty('--animation-play-state', 'running');
    if (lenis) lenis.start();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
});
