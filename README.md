# 🖼️ Image Converter - png2jpg.co

[![Deploy](https://github.com/yourusername/png2jpg.co/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/png2jpg.co/actions/workflows/deploy.yml)

A fast, free, and secure browser-based image format converter supporting multiple formats including PNG, JPG, WebP, SVG, GIF, and more.

**🌐 Live Site: [png2jpg.co](https://png2jpg.co)**

## ✨ Features

- **Multiple Format Support**: Convert between PNG, JPG, WebP, SVG, GIF, AVIF, ICO, TIFF
- **Batch Processing**: Upload and convert multiple images at once
- **Client-Side Processing**: All conversions happen in your browser - your images never leave your device
- **Drag & Drop**: Easy file upload with drag and drop support
- **Real-Time Preview**: See converted images instantly
- **Download Management**: Download individual files or clear all at once
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **PWA Ready**: Installable as a Progressive Web App

## 🎯 Why This Project?

What started as a simple PNG to JPG converter has evolved into a comprehensive image format conversion tool. The focus is on:

- **Privacy**: All processing happens client-side
- **Speed**: Instant conversions without server round-trips  
- **Simplicity**: Clean, intuitive interface
- **Reliability**: Comprehensive testing suite with 28+ tests

## 🛠️ Tech Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework
- **[Svelte](https://svelte.dev/)** - Reactive UI framework with latest runes API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Fast build tool

### Testing
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **Browser Testing** - Real browser environment testing

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[svelte-check](https://github.com/sveltejs/language-tools)** - TypeScript validation

### Deployment
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Fast, secure hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:DominicFrei/png2jpg.co.git
cd png2jpg.co

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running.

## 🧪 Testing

This project has comprehensive test coverage including unit tests, browser tests, and end-to-end tests.

```bash
# Run all tests (unit + e2e)
npm test

# Run only unit tests
npm run test:unit

# Run only e2e tests  
npm run test:e2e

# Run unit tests in watch mode (development)
npm run test:unit -- --watch
```

### Test Coverage
- **Unit Tests**: Core conversion logic, file handling, utilities
- **Browser Tests**: Real browser image conversion with Canvas API
- **E2E Tests**: Complete user workflows, drag & drop, error handling

## 🏗️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run format       # Format code with Prettier
npm run lint         # Check formatting and run ESLint
npm run check        # TypeScript validation with svelte-check
```

### Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── ImageConverter.svelte
│   │   ├── Header.svelte
│   │   └── Footer.svelte
│   ├── services/           # Business logic
│   │   └── ImageConverter.ts
│   ├── sections/           # Page sections
│   └── icons/             # SVG icon components
├── routes/                # SvelteKit routes
│   └── +page.svelte      # Homepage
tests/
├── unit/                  # Unit tests
├── e2e/                  # End-to-end tests
└── fixtures/             # Test assets
```

### Code Quality

The project maintains high code quality through:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Automated testing** with 28+ test cases
- **Pre-commit hooks** for code validation

## 🌐 Deployment

The site is automatically deployed using GitHub Actions:

1. **Build**: Code is built and tested
2. **Deploy**: Deployed to Firebase Hosting
3. **Verify**: Deployment verification

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase (requires Firebase CLI)
firebase deploy
```

## 🔧 Configuration

### Environment Setup
- No environment variables required for basic functionality
- All image processing happens client-side

### PWA Configuration
The app includes a web manifest for PWA installation:
- Installable on mobile devices
- Offline-capable
- App-like experience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run code quality checks (`npm run format && npm run lint && npm run check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for privacy-focused image conversion
- Thanks to the open-source community for the amazing tools

---

**Made with ❤️ for the web community**