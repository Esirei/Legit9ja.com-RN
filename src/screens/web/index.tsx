import React from 'react';
import { Linking, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import WebView from 'react-native-webview';
import { BannerAds } from '@components/Ads';
import { openExternalUrl } from '@helpers';
import { WebScreenParams } from './types';

const openExternal = openExternalUrl(event => {
  Linking.openURL(event.url);
});

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
