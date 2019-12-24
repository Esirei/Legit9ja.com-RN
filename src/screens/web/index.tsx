import React from 'react';
import { StyleSheet, SafeAreaView, Platform, Linking } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { BannerAds } from '@components/Ads';
import { WebScreenParams } from './types';

const openExternalUrl = (user: (event: WebViewNavigation) => void) => {
  const x = (event: WebViewNavigation) => {
    const { url, navigationType } = event;
    if (url) {
      // iOS calls method on 1st load, continue loading if url is about:blank.
      if (Platform.OS === 'ios') {
        if (navigationType !== 'click' || url === 'about:blank') {
          return true;
        }
      }
      user(event);
      return false;
    }
    return true;
  };
  return x;
};

const openExternal = (event: WebViewNavigation) => {
  const { url, navigationType } = event;
  if (url) {
    // iOS calls method on 1st load, continue loading if url is about:blank.
    if (Platform.OS === 'ios') {
      if (navigationType !== 'click' || url === 'about:blank') {
        return true;
      }
    }
    Linking.openURL(url);
    return false;
  }
  return true;
};

const Web: NavigationStackScreenComponent<WebScreenParams> = ({ navigation }) => {
  const uri = navigation.getParam('url', '');
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.webview}
        scalesPageToFit={false}
        onShouldStartLoadWithRequest={openExternal}
        onLoadEnd={event => console.log('onLoadEnd', event)}
      />
      <BannerAds size={'FULL_BANNER'} />
    </SafeAreaView>
  );
};

Web.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam('title', '');
  return {
    title,
  };
};

export default Web;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
