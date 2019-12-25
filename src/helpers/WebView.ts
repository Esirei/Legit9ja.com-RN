import { Platform } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';

export const openExternalUrl = (func: (event: WebViewNavigation) => void) => {
  return (event: WebViewNavigation) => {
    console.log('openExternalUrl', event);
    const { url, navigationType } = event;
    if (url) {
      // iOS calls method on 1st load, continue loading if url is about:blank.
      if (Platform.OS === 'ios' && (navigationType !== 'click' || url === 'about:blank')) {
        return true;
      }
      func(event);
      return false;
    }
    return true;
  };
};
