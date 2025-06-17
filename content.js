const PROCESSED_MARKER_CLASS = 'floating-copy-button-added';
const FLOATING_BUTTON_CLASS = 'floating-copy-button';

// Detect which site we're on
const isGeminiSite = window.location.hostname === 'gemini.google.com';
const isAIStudioSite = window.location.hostname === 'aistudio.google.com';

function createFloatingCopyButton(codeBlockElement) {
    // Check if we've already processed this code block
    if (codeBlockElement.classList.contains(PROCESSED_MARKER_CLASS)) {
        return;
    }

    let originalCopyButton = null;
    let referenceElement = null; // Element to observe for visibility
    let languageText = '';

    if (isGeminiSite) {
        // Gemini.google.com logic
        const header = codeBlockElement.querySelector('.code-block-decoration.header-formatted');
        if (!header) {
            return;
        }
        originalCopyButton = header.querySelector('button.copy-button');
        referenceElement = header;

        const languageLabel = header.querySelector('span');
        if (languageLabel) {
            languageText = languageLabel.textContent;
        }
    } else if (isAIStudioSite) {
        // AIStudio.google.com logic
        const msCodeBlock = codeBlockElement.querySelector('ms-code-block');
        if (!msCodeBlock) {
            return;
        }
        
        const footer = msCodeBlock.querySelector('footer');
        if (!footer) {
            return;
        }
        // Look for copy button in footer
        originalCopyButton = footer.querySelector('button[mattooltip*="Copy"], button[mattooltip*="copy"]');
        referenceElement = footer;

        // Get language from footer .language span (primary)
        const footerLanguageSpan = footer.querySelector('.language');
        if (footerLanguageSpan && footerLanguageSpan.textContent.trim() !== '') {
            languageText = footerLanguageSpan.textContent.trim();
        } else {
            // Fallback to header span.name
            const headerLanguageSpan = codeBlockElement.querySelector('.mat-expansion-panel-header .name');
            if (headerLanguageSpan && headerLanguageSpan.textContent.trim() !== '') {
                languageText = headerLanguageSpan.textContent.trim();
            } else {
                // Final fallback to detection from code content
                languageText = detectLanguageFromCode(msCodeBlock) || 'Code';
            }
        }
    }

    if (!originalCopyButton || !referenceElement) {
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

    // Add language label
    if (languageText) {
        const floatingLabel = document.createElement('span');
        floatingLabel.className = `${FLOATING_BUTTON_CLASS}-label`;
        floatingLabel.textContent = languageText;
        floatingContainer.appendChild(floatingLabel);
    }

    floatingContainer.appendChild(floatingButton);

    // Insert floating button at different positions based on site
    if (isGeminiSite) {
        // Gemini: Insert at the beginning (top)
        codeBlockElement.insertBefore(floatingContainer, codeBlockElement.firstChild);
    } else if (isAIStudioSite) {
        // AI Studio: Insert inside the ms-code-block at the end (bottom)
        const msCodeBlock = codeBlockElement.querySelector('ms-code-block');
        if (msCodeBlock) {
            msCodeBlock.appendChild(floatingContainer);
        }
    }

    // Mark as processed
    codeBlockElement.classList.add(PROCESSED_MARKER_CLASS);

    // Setup intersection observer to show/hide floating button
    setupFloatingButtonVisibility(codeBlockElement, floatingContainer, referenceElement);
}

function detectLanguageFromCode(codeBlockElement) {
    // Try to detect language from various sources
    const codeContent = codeBlockElement.querySelector('code');
    if (!codeContent) return null;

    const codeText = codeContent.textContent.trim();

    // Simple language detection based on common patterns
    if (codeText.includes('def ') || codeText.includes('import ') || codeText.includes('print(')) {
        return 'Python';
    }
    if (codeText.includes('function ') || codeText.includes('const ') || codeText.includes('console.log')) {
        return 'JavaScript';
    }
    if (codeText.includes('public class') || codeText.includes('System.out.print')) {
        return 'Java';
    }
    if (codeText.includes('#include') || codeText.includes('int main(')) {
        return 'C++';
    }
    if (codeText.includes('<!DOCTYPE') || codeText.includes('<html')) {
        return 'HTML';
    }
    if (codeText.includes('SELECT ') || codeText.includes('FROM ')) {
        return 'SQL';
    }

    return null;
}

function setupFloatingButtonVisibility(codeBlockElement, floatingContainer, referenceElement) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (isGeminiSite) {
                // On Gemini: Hide floating button when header is visible
                if (entry.isIntersecting) {
                    floatingContainer.style.opacity = '0';
                    floatingContainer.style.pointerEvents = 'none';
                } else {
                    floatingContainer.style.opacity = '1';
                    floatingContainer.style.pointerEvents = 'auto';
                }
            } else if (isAIStudioSite) {
                // On AI Studio: Show floating button when footer is NOT visible (opposite logic)
                if (entry.isIntersecting) {
                    floatingContainer.style.opacity = '0';
                    floatingContainer.style.pointerEvents = 'none';
                } else {
                    floatingContainer.style.opacity = '1';
                    floatingContainer.style.pointerEvents = 'auto';
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(referenceElement);
}

function processAllCodeBlocks() {
    let codeBlocks;

    if (isGeminiSite) {
        codeBlocks = document.querySelectorAll('div.code-block:not(.' + PROCESSED_MARKER_CLASS + ')');
    } else if (isAIStudioSite) {
        codeBlocks = document.querySelectorAll('mat-expansion-panel.code-block-container:not(.' + PROCESSED_MARKER_CLASS + ')');
    } else {
        return; // Unknown site
    }

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
                    let newCodeBlocks = [];

                    if (isGeminiSite) {
                        // Check if the added node is a code block itself
                        if (node.matches && node.matches('div.code-block')) {
                            setTimeout(() => createFloatingCopyButton(node), 100);
                        }
                        // Also check if the added node contains code blocks
                        else if (node.querySelectorAll) {
                            newCodeBlocks = node.querySelectorAll('div.code-block:not(.' + PROCESSED_MARKER_CLASS + ')');
                        }
                    } else if (isAIStudioSite) {
                        // Check if the added node is a mat-expansion-panel code block itself
                        if (node.matches && node.matches('mat-expansion-panel.code-block-container')) {
                            setTimeout(() => createFloatingCopyButton(node), 100);
                        }
                        // Also check if the added node contains code blocks
                        else if (node.querySelectorAll) {
                            newCodeBlocks = node.querySelectorAll('mat-expansion-panel.code-block-container:not(.' + PROCESSED_MARKER_CLASS + ')');
                        }
                    }

                    newCodeBlocks.forEach(codeBlockNode => {
                        setTimeout(() => createFloatingCopyButton(codeBlockNode), 100);
                    });
                }
            });
        }
    }
});

const targetNode = document.body;
const config = {childList: true, subtree: true};
observer.observe(targetNode, config);