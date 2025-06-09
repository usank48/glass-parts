import React, { useEffect, useState } from "react";

interface MobileWrapperProps {
  children: React.ReactNode;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const setupMobile = async () => {
      // Check if we're in a Capacitor environment
      const isCapacitor = window && (window as any).Capacitor;

      if (isCapacitor) {
        const { Capacitor } = await import("@capacitor/core");

        if (Capacitor.isNativePlatform()) {
          setIsNative(true);

          // Configure status bar
          try {
            const { StatusBar, Style } = await import("@capacitor/status-bar");
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: "#6366f1" });
          } catch (error) {
            console.log("StatusBar not available:", error);
          }

          // Hide splash screen
          try {
            const { SplashScreen } = await import("@capacitor/splash-screen");
            await SplashScreen.hide();
          } catch (error) {
            console.log("SplashScreen not available:", error);
          }

          // Add mobile-specific styles
          document.body.style.webkitUserSelect = "none";
          document.body.style.webkitTouchCallout = "none";
          document.body.style.webkitTapHighlightColor = "transparent";
        }
      }

      // Mobile web optimizations (always apply)
      const viewport = document.querySelector("meta[name=viewport]");
      if (viewport && window.innerWidth <= 768) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        );
      }
    };

    setupMobile();
  }, []);

  // Add mobile-specific classes
  const mobileClasses = isNative ? "native-app select-none" : "web-app";

  return (
    <div className={`mobile-wrapper ${mobileClasses}`}>
      {children}

      {/* Mobile-specific styles */}
      <style jsx global>{`
        .native-app {
          /* Prevent text selection on native apps */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          /* Disable callouts on long press */
          -webkit-touch-callout: none;

          /* Disable tap highlighting */
          -webkit-tap-highlight-color: transparent;

          /* Ensure full height on mobile */
          min-height: 100vh;
          min-height: 100dvh;
        }

        .native-app input,
        .native-app textarea,
        .native-app [contenteditable] {
          /* Re-enable text selection for inputs */
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }

        /* Improve touch targets for mobile */
        .native-app button,
        .native-app [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }

        /* Better scrolling on mobile */
        .native-app {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* Fix viewport height issues */
        .native-app .min-h-screen {
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* Improve dialog/modal behavior on mobile */
        .native-app [data-radix-dialog-overlay] {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
};
