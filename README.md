# TaskFlow

A clean, intuitive, mobile-first task management application built with React, Vite, and Tailwind CSS.

## Features

- **Intuitive Interface**: Clean and modern design optimized for mobile devices.
- **Task Management**: Create, edit, and delete tasks easily.
- **Due Dates & Reminders**: Prioritize tasks and set due dates.
- **Categories**: Organize tasks into different categories (e.g., Personal, Work, Shopping) with color coding.
- **Subtasks**: Break down complex tasks into manageable subtasks.
- **Local Storage**: Data persists in your browser.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Copy the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

Build the app for production:

```bash
npm run build
```

## GitHub Actions

This repository includes two GitHub Actions workflows:
1. `.github/workflows/build.yml`: Automatically installs dependencies, lints, and builds the web application on pushes to the main branch.
2. `.github/workflows/android-build.yml`: Builds an Android APK using Capacitor and uploads it as an artifact whenever code is merged to main.

### Generating the Android APK

1. Go to the "Actions" tab in your GitHub repository.
2. Select the "Build Android APK" workflow.
3. Once the workflow is completed, click on the workflow run.
4. Scroll down to the "Artifacts" section to download the `app-debug.apk` file.
5. Transfer the `.apk` file to your Android device and install it.
