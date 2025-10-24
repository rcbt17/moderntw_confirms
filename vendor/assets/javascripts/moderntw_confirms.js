(function() {
  'use strict';

  class ModerntwConfirms {
    constructor() {
      this.modal = null;
      this.currentCallback = null;
      this.focusedElementBeforeModal = null;
      this.initialized = false;
      this.initializationAttempts = 0;
      this.maxInitAttempts = 3;
      this.useModal = true;
      this.enableOnMobile = false;

      try {
        this.init();
      } catch (error) {
        console.error('ModerntwConfirms: Initialization failed', error);
        this.fallbackToNative();
      }
    }

    init() {
      if (this.initialized || this.initializationAttempts >= this.maxInitAttempts) {
        return;
      }

      this.initializationAttempts++;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      try {
        this.modal = document.getElementById('moderntw-confirm-modal');

        if (!this.modal) {
          if (this.initializationAttempts < this.maxInitAttempts) {
            setTimeout(() => this.init(), 500);
            return;
          } else {
            console.warn('ModerntwConfirms: Modal not found after multiple attempts. Falling back to native confirms.');
            this.fallbackToNative();
            return;
          }
        }

        this.setupModalElements();
        this.readConfiguration();
        this.useModal = this.shouldUseModal();

        if (!this.useModal) {
          console.info('ModerntwConfirms: Using native browser confirms on mobile devices.');
        }

        this.interceptTurboConfirms();
        this.setupModalHandlers();
        this.initialized = true;

      } catch (error) {
        console.error('ModerntwConfirms: Setup failed', error);
        this.fallbackToNative();
      }
    }

    fallbackToNative() {
      this.useModal = false;

      if (window.Turbo && window.Turbo.config && window.Turbo.config.forms) {
        Turbo.config.forms.confirm = (message) => {
          return Promise.resolve(window.confirm(message));
        };
      }
    }

    setupModalElements() {
      this.backdrop = this.modal.querySelector('[data-modal-backdrop]');
      this.panel = this.modal.querySelector('[data-modal-panel]');
      this.messageEl = this.modal.querySelector('[data-modal-message]');
      this.titleEl = this.modal.querySelector('[data-modal-title]');
      this.confirmBtn = this.modal.querySelector('[data-modal-confirm]');
      this.cancelBtn = this.modal.querySelector('[data-modal-cancel]');
      this.iconWrapper = this.modal.querySelector('[data-modal-icon-wrapper]');
      this.infoIcon = this.modal.querySelector('[data-modal-icon="info"]');
      this.dangerIcon = this.modal.querySelector('[data-modal-icon="danger"]');

      if (!this.messageEl || !this.confirmBtn || !this.cancelBtn) {
        throw new Error('Critical modal elements not found');
      }
    }

    interceptTurboConfirms() {
      const self = this;

      if (window.Turbo && window.Turbo.config && window.Turbo.config.forms) {
        Turbo.config.forms.confirm = (message) => {
          return new Promise((resolve) => {
            try {
              self.showModal(message, resolve);
            } catch (error) {
              console.error('ModerntwConfirms: Error showing modal', error);
              resolve(window.confirm(message));
            }
          });
        };
      }

      this.formSubmitHandler = (event) => {
        try {
          const element = event.target;
          const message = element.getAttribute('data-turbo-confirm') || element.getAttribute('data-confirm');

          if (message && !element.hasAttribute('data-moderntw-confirmed')) {
            event.preventDefault();

            if (event.detail && event.detail.formSubmission) {
              event.detail.formSubmission.stop();
            }

            this.showModal(message, (confirmed) => {
              if (confirmed) {
                element.setAttribute('data-moderntw-confirmed', 'true');
                element.requestSubmit();
                setTimeout(() => element.removeAttribute('data-moderntw-confirmed'), 100);
              }
            });
          }
        } catch (error) {
          console.error('ModerntwConfirms: Error in form submit handler', error);
        }
      };

      document.addEventListener('turbo:submit-start', this.formSubmitHandler);

      this.clickHandler = (event) => {
        try {
          let element = event.target;

          while (element && element !== document.body) {
            if (element.hasAttribute('data-turbo-confirm') || element.hasAttribute('data-confirm')) {
              break;
            }
            element = element.parentElement;
          }

          if (!element || element === document.body) return;

          const message = element.getAttribute('data-turbo-confirm') || element.getAttribute('data-confirm');

          if (message && !element.hasAttribute('data-moderntw-confirmed')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            this.showModal(message, (confirmed) => {
              if (confirmed) {
                element.setAttribute('data-moderntw-confirmed', 'true');

                const turboConfirm = element.getAttribute('data-turbo-confirm');
                const dataConfirm = element.getAttribute('data-confirm');
                element.removeAttribute('data-turbo-confirm');
                element.removeAttribute('data-confirm');

                if (element.tagName === 'FORM') {
                  element.requestSubmit();
                } else if (element.tagName === 'BUTTON' && element.form) {
                  element.form.requestSubmit(element);
                } else {
                  element.click();
                }

                setTimeout(() => {
                  if (turboConfirm) element.setAttribute('data-turbo-confirm', turboConfirm);
                  if (dataConfirm) element.setAttribute('data-confirm', dataConfirm);
                  element.removeAttribute('data-moderntw-confirmed');
                }, 100);
              }
            });

            return false;
          }
        } catch (error) {
          console.error('ModerntwConfirms: Error in click handler', error);
        }
      };

      document.addEventListener('click', this.clickHandler, true);
    }

    setupModalHandlers() {
      if (this.cancelBtn) {
        this.cancelBtnHandler = () => this.handleAction(false);
        this.cancelBtn.addEventListener('click', this.cancelBtnHandler);
      }

      if (this.backdrop) {
        this.backdropHandler = () => this.handleAction(false);
        this.backdrop.addEventListener('click', this.backdropHandler);
      }

      if (this.confirmBtn) {
        this.confirmBtnHandler = () => this.handleAction(true);
        this.confirmBtn.addEventListener('click', this.confirmBtnHandler);
      }

      this.escHandler = (e) => {
        if (e.key === 'Escape' && this.isModalOpen()) {
          e.preventDefault();
          this.handleAction(false);
        }
      };
      document.addEventListener('keydown', this.escHandler);

      this.tabHandler = (e) => {
        if (e.key === 'Tab' && this.isModalOpen()) {
          this.trapFocus(e);
        }
      };
      this.modal.addEventListener('keydown', this.tabHandler);
    }

    showModal(message, callback) {
      if (!this.modal || !this.initialized || !this.useModal) {
        const result = window.confirm(message);
        if (callback) callback(result);
        return;
      }

      try {
        this.currentCallback = callback;
        this.focusedElementBeforeModal = document.activeElement;

        if (this.messageEl) {
          this.messageEl.textContent = String(message || 'Are you sure?');
        }

        const isDanger = /delete|remove|destroy|reset|clear|drop|erase|cancel/i.test(message);
        this.setModalType(isDanger ? 'danger' : 'info');

        this.modal.classList.remove('hidden');
        this.modal.offsetHeight;

        requestAnimationFrame(() => {
          this.modal.classList.add('modal-showing');
        });

        setTimeout(() => {
          if (this.confirmBtn) {
            this.confirmBtn.focus();
          }
        }, 100);

        document.body.style.overflow = 'hidden';

      } catch (error) {
        console.error('ModerntwConfirms: Error showing modal', error);
        const result = window.confirm(message);
        if (callback) callback(result);
      }
    }

    setModalType(type) {
      try {
        const defaultBtnClass = this.confirmBtn?.getAttribute('data-confirm-default-class');
        const dangerBtnClass = this.confirmBtn?.getAttribute('data-confirm-danger-class');

        if (type === 'danger') {
          if (this.infoIcon) this.infoIcon.classList.add('hidden');
          if (this.dangerIcon) this.dangerIcon.classList.remove('hidden');
          if (this.iconWrapper) {
            this.iconWrapper.className = 'flex h-12 w-12 items-center justify-center rounded-full bg-red-50';
          }

          if (this.confirmBtn && dangerBtnClass) {
            this.confirmBtn.className = dangerBtnClass;
          }

          if (this.titleEl) {
            this.titleEl.textContent = 'Are you absolutely sure?';
          }
        } else {
          if (this.infoIcon) this.infoIcon.classList.remove('hidden');
          if (this.dangerIcon) this.dangerIcon.classList.add('hidden');
          if (this.iconWrapper) {
            this.iconWrapper.className = 'flex h-12 w-12 items-center justify-center rounded-full bg-blue-50';
          }

          if (this.confirmBtn && defaultBtnClass) {
            this.confirmBtn.className = defaultBtnClass;
          }

          if (this.titleEl) {
            this.titleEl.textContent = 'Confirmation Required';
          }
        }
      } catch (error) {
        console.error('ModerntwConfirms: Error setting modal type', error);
      }
    }

    handleAction(confirmed) {
      if (!this.modal) return;

      try {
        this.modal.classList.remove('modal-showing');

        setTimeout(() => {
          this.modal.classList.add('hidden');

          document.body.style.overflow = '';

          if (this.focusedElementBeforeModal && this.focusedElementBeforeModal.focus) {
            try {
              this.focusedElementBeforeModal.focus();
            } catch (e) {
            }
          }

          if (this.currentCallback) {
            const callback = this.currentCallback;
            this.currentCallback = null;
            callback(confirmed);
          }
        }, 300);
      } catch (error) {
        console.error('ModerntwConfirms: Error handling action', error);
        if (this.currentCallback) {
          this.currentCallback(confirmed);
        }
      }
    }

    isModalOpen() {
      return this.modal && !this.modal.classList.contains('hidden');
    }

    trapFocus(e) {
      try {
        const focusableElements = this.modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      } catch (error) {
        console.error('ModerntwConfirms: Error trapping focus', error);
      }
    }

    destroy() {
      if (this.formSubmitHandler) {
        document.removeEventListener('turbo:submit-start', this.formSubmitHandler);
      }
      if (this.clickHandler) {
        document.removeEventListener('click', this.clickHandler, true);
      }
      if (this.escHandler) {
        document.removeEventListener('keydown', this.escHandler);
      }
      if (this.cancelBtn && this.cancelBtnHandler) {
        this.cancelBtn.removeEventListener('click', this.cancelBtnHandler);
      }
      if (this.backdrop && this.backdropHandler) {
        this.backdrop.removeEventListener('click', this.backdropHandler);
      }
      if (this.confirmBtn && this.confirmBtnHandler) {
        this.confirmBtn.removeEventListener('click', this.confirmBtnHandler);
      }
      if (this.modal && this.tabHandler) {
        this.modal.removeEventListener('keydown', this.tabHandler);
      }
    }

    readConfiguration() {
      try {
        if (!this.modal || !this.modal.dataset) {
          this.enableOnMobile = false;
          return;
        }

        this.enableOnMobile = this.modal.dataset.enableOnMobile === 'true';
      } catch (error) {
        console.error('ModerntwConfirms: Error reading configuration', error);
        this.enableOnMobile = false;
      }
    }

    shouldUseModal() {
      try {
        if (this.enableOnMobile) {
          return true;
        }

        return !this.isMobileDevice();
      } catch (error) {
        console.error('ModerntwConfirms: Error determining modal usage preference', error);
        return true;
      }
    }

    isMobileDevice() {
      try {
        const touchCapable = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        const narrowViewport = window.matchMedia ? window.matchMedia('(max-width: 768px)').matches : false;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
        const mobileRegex = /Mobi|Android|iP(ad|hone|od)|Silk|Kindle|BlackBerry|IEMobile|Opera Mini/i;

        return touchCapable && (narrowViewport || mobileRegex.test(userAgent));
      } catch (error) {
        console.error('ModerntwConfirms: Error detecting device type', error);
        return false;
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.ModerntwConfirms = ModerntwConfirms;

    const initializeOnce = () => {
      try {
        if (window.moderntwConfirmsInstance && window.moderntwConfirmsInstance.destroy) {
          window.moderntwConfirmsInstance.destroy();
        }

        window.moderntwConfirmsInstance = new ModerntwConfirms();
      } catch (error) {
        console.error('ModerntwConfirms: Failed to initialize', error);
      }
    };

    if (window.Turbo) {
      initializeOnce();
    }

    document.addEventListener('turbo:load', initializeOnce);
    document.addEventListener('DOMContentLoaded', initializeOnce);

    if (document.readyState !== 'loading') {
      setTimeout(initializeOnce, 100);
    }
  }
})();
