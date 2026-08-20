(() => {
  const modal = document.getElementById("contactModal");
  const contactLink = document.querySelector("[data-contact-open]");
  const contactFrame = document.getElementById("contactFrame");
  const closeButtons = modal.querySelectorAll("[data-contact-close]");

  let previouslyFocusedElement = null;
  let closeTimer;

  function openContactModal(event) {
    event.preventDefault();

    window.clearTimeout(closeTimer);

    previouslyFocusedElement = document.activeElement;

    if (!contactFrame.src) {
      contactFrame.src = contactLink.href;
    }

    modal.hidden = false;
    document.body.classList.add("contact-modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      modal
        .querySelector(".contact-modal__close")
        .focus();
    });
  }

  function closeContactModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("contact-modal-open");

    closeTimer = window.setTimeout(() => {
      modal.hidden = true;

      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }, 250);
  }

  contactLink.addEventListener("click", openContactModal);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeContactModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.hidden && event.key === "Escape") {
      closeContactModal();
    }
  });
})();
