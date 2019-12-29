import React, { memo } from 'react';
import { Dimensions, Linking, StyleSheet } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import YouTube from '@screens/post/components/YouTube';
import { postContentWithoutYT } from '@helpers/post';
import { NavigationService } from '@navigation';
import { openExternalUrl } from '@helpers';

const postSlugRegex = /legit9ja.com\/[0-9]{4}\/[0-9]{2}\/(.*)\.html/;
const css =
  '<style>body{width:100%;margin:0;text-align:start;} img{max-width:100%;height:auto;} iframe{width:100%;height:auto;} p{font-size:16px!important;line-height:20px!important;} video{max-width:100%;height:auto;} a{color:#008000}</style>';

const onShouldStartLoadWithRequest = openExternalUrl(event => {
  const { url } = event;
  console.log('openExternalUrl - custom', event);
  const matches = postSlugRegex.exec(url);
  if (matches) {
    const post_slug = matches[1];
    NavigationService.navToPost({ post: post_slug, source: 'slug' });
  } else {
    Linking.openURL(url);
  }
});

const Content = ({ post }) => {
  const html = css + postContentWithoutYT(post);

  return (
    <>
      <AutoHeightWebView
        source={{ html }}
        style={styles.webview}
        containerStyle={styles.webviewContainer}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        scalesPageToFit={false}
        zoomable={false}
        bounces={false}
        scrollEnabled={false}
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
