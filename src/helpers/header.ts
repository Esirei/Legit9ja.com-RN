import { Platform, StatusBar } from 'react-native';
import { Header } from 'react-navigation-stack';

// ios doesn't render a view for it's statusBar, so it's 0
const RenderedStatusBarHeight = StatusBar.currentHeight || 0;

// StatusBar height to be deducted if device has inset(notch) at the top, statusBar is most likely rendered in the inset.
const RealStatusBarHeight = Platform.select({
  android: RenderedStatusBarHeight,
  ios: 20, // Removing ios statusBar height from react-navigation's Header.Height getter
  default: 0,
});

// Header + StatusBar heights.
// We hiding system rendered statusBar view in android, so need to add the height to rendered AppBar to emulate it.
const DefaultAppBarHeight = Header.HEIGHT + RenderedStatusBarHeight;

// AppBar height without status bar.
const RealAppBarHeight = DefaultAppBarHeight - RealStatusBarHeight;

export const HeaderHeight = hasStatusBar => (hasStatusBar ? RealAppBarHeight : DefaultAppBarHeight);
