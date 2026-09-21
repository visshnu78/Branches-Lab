// public/js/modal.js

document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('inquiryModalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const inquiryForm = document.getElementById('inquiryForm');
  const submitBtn = document.getElementById('inquirySubmitBtn');
  const serviceSelect = document.getElementById('formService');
  const toastContainer = document.getElementById('toastContainer');

  function openModal(preselectedService = '') {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (preselectedService && serviceSelect) {
      // Find matching option or set it
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openInquiryModal = openModal;
  window.closeInquiryModal = closeModal;

  // Trigger buttons: navbar CTA, hero CTA, footer CTA
  document.querySelectorAll('.open-inquiry-modal, a[href="#contact"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Toast helper
  function showToast(title, message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="font-size: 1.2rem;">${type === 'success' ? '✅' : '⚠️'}</div>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Form Validation & Submission
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset errors
      document.querySelectorAll('.form-error').forEach((el) => el.classList.remove('visible'));

      const clientName = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const company = document.getElementById('formCompany').value.trim();
      const serviceType = document.getElementById('formService').value;
      const budget = document.getElementById('formBudget').value;
      const timeline = document.getElementById('formTimeline').value;
      const details = document.getElementById('formDetails').value.trim();

      let hasError = false;

      if (clientName.length < 2) {
        showFieldError('formNameError', 'Please enter your name.');
        hasError = true;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('formEmailError', 'Please enter a valid email address.');
        hasError = true;
      }

      if (!serviceType) {
        showFieldError('formServiceError', 'Please select a service.');
        hasError = true;
      }

      if (!budget) {
        showFieldError('formBudgetError', 'Please select a budget range.');
        hasError = true;
      }

      if (!timeline) {
        showFieldError('formTimelineError', 'Please select a timeline.');
        hasError = true;
      }

      if (details.length < 10) {
        showFieldError('formDetailsError', 'Please provide a brief description (min 10 characters).');
        hasError = true;
      }

      if (hasError) return;

      // Loading state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      try {
        const response = await window.API.submitInquiry({
          clientName,
          email,
          company,
          serviceType,
          budget,
          timeline,
          details
        });

        if (response.success) {
          showToast('Inquiry Sent!', response.message || 'We will get back to you shortly.');
          inquiryForm.reset();
          closeModal();
        } else {
          showToast('Submission Failed', response.message || 'Please check your information.', 'error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        showToast('Network Error', 'Could not connect to server. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function showFieldError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }
});
