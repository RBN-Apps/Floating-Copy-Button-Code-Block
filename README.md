# Gemini Sticky Code Header

A small Chrome extension that makes the header (or footer) of code blocks on Gemini and AI Studio sticky, so the copy button (and language label) remain visible while you scroll.

---

## Features

- **Sticky Header** on Gemini ([`gemini.google.com`](https://gemini.google.com/))  
  Keeps the code‐block header fixed at the top of its container.

- **Sticky Footer** on AI Studio ([`aistudio.google.com`](https://aistudio.google.com/))  
  Keeps the code‐block footer fixed at the bottom of its container.

- **Floating Copy Button**  
  Always-visible copy icon that duplicates the behavior of the site’s native copy button.

- **Language Label**  
  Displays the detected or declared language (e.g. “Python”, “JavaScript”) in the floating header/footer.

- **Dark & Light Theme Support**  
  Automatically adapts to the user’s OS or browser theme.

---

## Installation

1. Download the latest Release from the [Releases Page](https://github.com/RBN-Apps/Floating-Copy-Button-Code-Block/releases/latest)
2. Unzip the downloaded file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in the top right corner)
5. Click **Load unpacked** and select the unzipped folder containing the extension files.
6. Navigate to Gemini or AI Studio, and the sticky copy button should appear when you scroll past the native header/footer.

---

## Project Structure

```
│
├── content.js        # Main script: detects code blocks, clones the copy button, and manages visibility
├── styles.css        # Sticky container styling, dark/light themes, transitions
├── manifest.json     # Chrome Extension manifest (v3)
└── icons/            # Extension icons (16×16, 48×48, 128×128)
```

---

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Submit a Pull Request.

Please ensure any new changes respect existing code style (ES6, CSS variables) and add comments where appropriate.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

*Enjoy seamless copying on [Gemini](https://gemini.google.com/) and [AI Studio](https://aistudio.google.com/)!*
