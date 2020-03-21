import { Platform, StatusBar } from 'react-native';
import { Header } from 'react-navigation-stack';
import { useSafeArea } from 'react-native-safe-area-context';

// ios doesn't automatically render a view for it's statusBar, so it's 0
const PlatformStatusBarHeight = StatusBar.currentHeight || 0;

// Actual statusBar height perceived by user.
// StatusBar height to be deducted if device has inset(notch) at the top, statusBar is most likely rendered in the inset.
const RenderedStatusBarHeight = Platform.select({
  android: PlatformStatusBarHeight,
  ios: 20, // Removing ios statusBar height from react-navigation's Header.Height getter
  default: 0,
});

// Header + StatusBar heights.
// If hiding system rendered statusBar view in android, might need to add the height to rendered Header to emulate it.
// The Header.Height getter from react-navigation already contains rendered statusbar height for iOS
const HeaderAndStatusBarHeight = Header.HEIGHT + PlatformStatusBarHeight;

// Header height excluding the status bar.
const RenderedHeaderHeight = HeaderAndStatusBarHeight - RenderedStatusBarHeight;

export const HeaderHeight = (hasStatusBar: boolean) => {
  if (hasStatusBar && Platform.OS === 'android') {
    return RenderedHeaderHeight;
  }
  return HeaderAndStatusBarHeight;
};

export const HeaderWithNotchHeight = (safeArea: number, hasStatusBar: boolean) => {
  return safeArea ? RenderedHeaderHeight + safeArea : HeaderHeight(hasStatusBar);
};

// export const useSafeHeaderHeight = (considerStatusBar: boolean) => {
//   const safeArea = useSafeArea();
//   return HeaderWithNotchHeight(safeArea.top, considerStatusBar);
// };
