import React, { memo } from 'react';
import { Dimensions, Linking, StyleSheet } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import YouTube from '@screens/post/components/YouTube';
import { postContentWithoutYT } from '@helpers/post';

const css =
  '<style>body{width:100%;margin:0;text-align:start;}img {max-width:100%;height:auto;} iframe{width:100%;height:auto;}</style>';
const Content = ({ post }) => {
  const html = css + postContentWithoutYT(post);

  const openExternalUrl = (webEvent: WebViewNavigation) => {
    if (webEvent.url) {
      Linking.openURL(webEvent.url);
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
