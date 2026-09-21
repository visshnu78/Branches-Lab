// public/js/services.js

document.addEventListener('DOMContentLoaded', () => {
  const servicesGrid = document.getElementById('servicesGrid');
  const searchInput = document.getElementById('serviceSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const emptyState = document.getElementById('servicesEmptyState');

  let currentCategory = 'ALL';
  let currentSearch = '';
  let debounceTimeout = null;

  async function renderServices() {
    if (!servicesGrid) return;

    try {
      const response = await window.API.getServices(currentCategory, currentSearch);
      const services = response.data?.services || [];

      if (services.length === 0) {
        servicesGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      servicesGrid.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';

      servicesGrid.innerHTML = services
        .map((s, index) => {
          const delayClass = index > 0 ? `reveal-delay-${Math.min(index, 5)}` : '';
          const iconBgClass =
            s.category === 'STRATEGY' ? 'icon-blue' :
            s.category === 'DESIGN' ? 'icon-purple' :
            s.category === 'ENGINEERING' ? 'icon-green' :
            s.category === 'AI_DATA' ? 'icon-amber' :
            s.category === 'INFRASTRUCTURE' ? 'icon-blue' : 'icon-purple';

          return `
            <div class="service-card reveal visible ${delayClass}" data-category="${s.category}">
              <div class="service-icon ${iconBgClass}">${s.icon || '💡'}</div>
              <h3>${escapeHtml(s.title)}</h3>
              <p>${escapeHtml(s.description)}</p>
              <a href="#contact" class="service-link open-inquiry-btn" data-service="${escapeHtml(s.title)}">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>
              </a>
            </div>
          `;
        })
        .join('');

      // Re-bind "Learn More" buttons to open the modal with pre-selected service
      document.querySelectorAll('.open-inquiry-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const serviceTitle = btn.getAttribute('data-service');
          if (window.openInquiryModal) {
            window.openInquiryModal(serviceTitle);
          }
        });
      });
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Category filter clicks
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderServices();
    });
  });

  // Search input with debounce
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        renderServices();
      }, 250);
    });
  }

  // Initial load
  renderServices();
});
