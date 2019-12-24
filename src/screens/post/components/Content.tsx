import React, { memo } from 'react';
import { Dimensions, Linking, StyleSheet, Platform } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import YouTube from '@screens/post/components/YouTube';
import { postContentWithoutYT } from '@helpers/post';
import { NavigationService } from '@navigation';

const postSlugRegex = /legit9ja.com\/[0-9]{4}\/[0-9]{2}\/(.*)\.html/;
const css =
  '<style>body{width:100%;margin:0;text-align:start;}img {max-width:100%;height:auto;} iframe{width:100%;height:auto;}</style>';
const Content = ({ post }) => {
  const html = css + postContentWithoutYT(post);

  const openExternalUrl = (event: WebViewNavigation) => {
    console.log('openExternalUrl', event);
    const { url, navigationType } = event;
    if (url) {
      // iOS calls method on 1st load, continue loading if url is about:blank.
      if (Platform.OS === 'ios') {
        if (navigationType !== 'click' || url === 'about:blank') {
          return true;
        }
      }
      console.log('openExternalUrl - custom', event);
      const matches = postSlugRegex.exec(url);
      if (matches) {
        const post_slug = matches[1];
        NavigationService.navToPost({ post: post_slug, source: 'slug' });
      } else {
        Linking.openURL(url);
      }
      return false;
    }
    return true;
  };

  return (
    <>
      <AutoHeightWebView
        source={{ html }}
        style={styles.webview}
        containerStyle={styles.webviewContainer}
        onShouldStartLoadWithRequest={openExternalUrl}
        scalesPageToFit={false}
        zoomable={false}
        bounces={false}
      />
      <YouTube post={post} />
    </>
  );
};

export default memo(Content);

const styles = StyleSheet.create({
  webview: { width: Dimensions.get('window').width - 16, marginTop: 16 },
  webviewContainer: { alignItems: 'center' },
});
