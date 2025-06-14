const PROCESSED_MARKER_CLASS = 'floating-copy-button-added';
const FLOATING_BUTTON_CLASS = 'floating-copy-button';

function createFloatingCopyButton(codeBlockElement) {
  // Check if we've already processed this code block
  if (codeBlockElement.classList.contains(PROCESSED_MARKER_CLASS)) {
    return;
  }

  const header = codeBlockElement.querySelector('.code-block-decoration.header-formatted');

  if (!header) {
    return;
  }

  // Find the original copy button
  const originalCopyButton = header.querySelector('button.copy-button');
  if (!originalCopyButton) {
    return;
  }

  // Create floating button container
  const floatingContainer = document.createElement('div');
  floatingContainer.className = `${FLOATING_BUTTON_CLASS}-container`;

  // Clone the original copy button
  const floatingButton = originalCopyButton.cloneNode(true);
  floatingButton.className = `${FLOATING_BUTTON_CLASS}`;

  // Add click handler to floating button
  floatingButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    originalCopyButton.click();
  });

  // Add language label if exists
  const languageLabel = header.querySelector('span');
  if (languageLabel) {
    const floatingLabel = document.createElement('span');
    floatingLabel.className = `${FLOATING_BUTTON_CLASS}-label`;
    floatingLabel.textContent = languageLabel.textContent;
    floatingContainer.appendChild(floatingLabel);
  }

  floatingContainer.appendChild(floatingButton);

  // Insert floating button at the beginning of code block
  codeBlockElement.insertBefore(floatingContainer, codeBlockElement.firstChild);

  // Mark as processed
  codeBlockElement.classList.add(PROCESSED_MARKER_CLASS);

  // Setup intersection observer to show/hide floating button
  setupFloatingButtonVisibility(codeBlockElement, floatingContainer, header);
}

function setupFloatingButtonVisibility(codeBlockElement, floatingContainer, originalHeader) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Original header is visible, hide floating button
        floatingContainer.style.opacity = '0';
        floatingContainer.style.pointerEvents = 'none';
      } else {
        // Original header is not visible, show floating button
        floatingContainer.style.opacity = '1';
        floatingContainer.style.pointerEvents = 'auto';
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  observer.observe(originalHeader);
}

function processAllCodeBlocks() {
  const codeBlocks = document.querySelectorAll('div.code-block:not(.' + PROCESSED_MARKER_CLASS + ')');
  codeBlocks.forEach(createFloatingCopyButton);
}

// Initial run when the script is injected
processAllCodeBlocks();

// Observer for dynamically added code blocks
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is a code block itself
          if (node.matches && node.matches('div.code-block')) {
            setTimeout(() => createFloatingCopyButton(node), 100);
          }
          // Also check if the added node contains code blocks
          else if (node.querySelectorAll) {
            const newCodeBlocks = node.querySelectorAll('div.code-block:not(.' + PROCESSED_MARKER_CLASS + ')');
            newCodeBlocks.forEach(codeBlockNode => {
              setTimeout(() => createFloatingCopyButton(codeBlockNode), 100);
            });
          }
        }
      });
    }
  }
});

const targetNode = document.body;
const config = { childList: true, subtree: true };
observer.observe(targetNode, config);