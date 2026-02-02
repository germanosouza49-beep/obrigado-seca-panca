/**
 * Metodo Zero v15
 * Zero build step. Vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initForms();
  initPhoneInput();
});

/* ==========================================
   AOS (Animate On Scroll)
   ========================================== */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }
}

/* ==========================================
   FORMULARIOS
   ========================================== */

// Dominios de email temporario (bloqueados)
const tempEmailDomains = [
  'tempmail', 'guerrillamail', '10minutemail', 'mailinator',
  'throwaway', 'fakeinbox', 'yopmail', 'trashmail', 'temp-mail',
  'disposable', 'sharklasers', 'guerrillamail'
];

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1].toLowerCase();
  return !tempEmailDomains.some(temp => domain.includes(temp));
}

function initForms() {
  const forms = document.querySelectorAll('form[data-form]');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('.form-feedback');

  // Validacao
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    field.classList.remove('error');

    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    }

    // Email
    if (field.type === 'email' && field.value) {
      if (!isValidEmail(field.value)) {
        field.classList.add('error');
        isValid = false;
      }
    }

    // Telefone (intl-tel-input)
    if (field.type === 'tel' && window.itiInstance) {
      if (!window.itiInstance.isValidNumber()) {
        field.classList.add('error');
        isValid = false;
      }
    }
  });

  if (!isValid) {
    showFeedback(feedback, 'error', 'Por favor, preencha todos os campos corretamente.');
    return;
  }

  // Atualiza telefone com formato internacional antes do envio
  if (window.itiInstance) {
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.value = window.itiInstance.getNumber();
    }
  }

  // Loading
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const formData = new FormData(form);

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      showFeedback(feedback, 'success', 'Mensagem enviada com sucesso!');
      form.reset();
      if (window.itiInstance) {
        window.itiInstance.setNumber('');
      }
    } else {
      throw new Error('Erro no envio');
    }
  } catch (error) {
    showFeedback(feedback, 'error', 'Erro ao enviar. Tente novamente.');
    console.error('Form error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function showFeedback(element, type, message) {
  if (!element) return;
  element.className = 'form-feedback ' + type;
  element.textContent = message;

  setTimeout(() => {
    element.className = 'form-feedback';
    element.textContent = '';
  }, 5000);
}

/* ==========================================
   INTL-TEL-INPUT (Telefone Internacional)
   ========================================== */

function initPhoneInput() {
  const phoneInput = document.querySelector('input[type="tel"]');
  if (!phoneInput || typeof intlTelInput === 'undefined') return;

  window.itiInstance = intlTelInput(phoneInput, {
    initialCountry: 'br',
    preferredCountries: ['br', 'us', 'pt'],
    separateDialCode: true,
    strictMode: true,
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js'
  });
}
