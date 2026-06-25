export function initFeedback() {
  const openLink = document.querySelector('#footer-feedback-link');
  const modal = document.querySelector('#feedback-modal');
  const closeButton = document.querySelector('#feedback-modal-close');
  const thanksCloseButton = document.querySelector('#feedback-thanks-close');
  const formView = document.querySelector('#feedback-form-view');
  const thanksView = document.querySelector('#feedback-thanks');
  const form = document.querySelector('#feedback-form');
  const nameInput = document.querySelector('#feedback-name');
  const emailInput = document.querySelector('#feedback-email');
  const feedbackInput = document.querySelector('#feedback-message');
  const errorMessage = document.querySelector('#feedback-error');

  const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const feedbackRegex = /^.{10,500}$/s;

  function openModal() {
    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    formView.classList.remove('is-hidden');
    thanksView.classList.add('is-hidden');
    errorMessage.textContent = '';
    form.reset();
    nameInput.focus();
  }

  function closeModal() {
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  openLink.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  closeButton.addEventListener('click', closeModal);
  thanksCloseButton.addEventListener('click', closeModal);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!nameRegex.test(nameInput.value.trim())) {
      errorMessage.textContent = 'Enter a valid name.';
      return;
    }

    if (!emailRegex.test(emailInput.value.trim())) {
      errorMessage.textContent = 'Enter a valid e-mail address.';
      return;
    }

    if (!feedbackRegex.test(feedbackInput.value.trim())) {
      errorMessage.textContent = 'Feedback must be 10 to 500 characters long.';
      return;
    }

    formView.classList.add('is-hidden');
    thanksView.classList.remove('is-hidden');
  });
}