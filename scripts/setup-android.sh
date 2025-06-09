#!/bin/bash

echo "🚀 Setting up AutoParts Pro for Android development..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if not already installed
print_info "Installing dependencies..."
npm install

# Build the web application
print_info "Building the web application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix any build errors before proceeding."
    exit 1
fi

print_status "Web application built successfully"

# Add Android platform
print_info "Adding Android platform..."
npx cap add android

if [ $? -ne 0 ]; then
    print_error "Failed to add Android platform. Make sure Capacitor is properly configured."
    exit 1
fi

print_status "Android platform added successfully"

# Sync web assets to Android
print_info "Syncing web assets to Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    print_error "Failed to sync assets to Android."
    exit 1
fi

print_status "Assets synced successfully"

# Check if Android Studio is installed
if command -v studio &> /dev/null || command -v android-studio &> /dev/null; then
    print_status "Android Studio detected"
    
    echo ""
    print_info "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Open the project in Android Studio:"
    echo "   ${BLUE}npx cap open android${NC}"
    echo ""
    echo "2. Or build the APK directly:"
    echo "   ${BLUE}cd android && ./gradlew assembleDebug${NC}"
    echo ""
    echo "3. For development with live reload:"
    echo "   ${BLUE}npm run android:dev${NC}"
    echo ""
else
    print_warning "Android Studio not detected"
    echo ""
    print_info "To complete the setup:"
    echo "1. Install Android Studio: https://developer.android.com/studio"
    echo "2. Install Android SDK and build tools"
    echo "3. Run: ${BLUE}npx cap open android${NC}"
fi

echo ""
print_info "Available npm scripts for mobile development:"
echo "  ${BLUE}npm run build:mobile${NC}     - Build and sync for mobile"
echo "  ${BLUE}npm run android:dev${NC}      - Build, sync, and open Android Studio"
echo "  ${BLUE}npm run android:build${NC}    - Build and sync for Android"
echo "  ${BLUE}npm run mobile:sync${NC}      - Sync changes to mobile platforms"
