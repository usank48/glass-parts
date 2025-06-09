#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Initializing AutoParts Pro for Android development...\n");

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists`);
    return true;
  } else {
    console.log(`⚠️  ${description} not found`);
    return false;
  }
}

console.log("🔍 Checking project structure...");
checkFile("dist/index.html", "Build output");
checkFile("capacitor.config.ts", "Capacitor config");
checkFile("package.json", "Package configuration");
console.log();

// Add Android platform
console.log("📱 Setting up Android platform...");
try {
  runCommand("npx cap add android", "Adding Android platform");
} catch (error) {
  console.log("⚠️  Android platform may already exist, continuing...");
}

// Sync the built web app to Android
runCommand("npx cap sync android", "Syncing web assets to Android");

console.log("🎉 Android setup completed successfully!\n");

console.log("📋 Next steps:");
console.log("1. Install Android Studio: https://developer.android.com/studio");
console.log("2. Open the Android project:");
console.log("   npx cap open android");
console.log("3. Build and run your app in Android Studio\n");

console.log("🔧 Development commands:");
console.log("• npm run android:dev     - Build and open Android Studio");
console.log("• npm run android:build   - Build for Android production");
console.log("• npm run build:mobile    - Build and sync mobile assets");
console.log("• npm run mobile:sync     - Sync changes to mobile platforms\n");

console.log("📖 For detailed instructions, see: ANDROID_SETUP.md");
