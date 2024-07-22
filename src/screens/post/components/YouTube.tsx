import React, { useRef, useState, memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Youtube from 'react-native-youtube';
import { youtubeId } from '@helpers/post';
import { YOUTUBE_API_KEY } from '@env';

const YouTube = ({ post }) => {
  const videoId = youtubeId(post);
  const [state, setState] = useState({
    fullscreen: false,
  });

  const youtubeRef = useRef<Youtube>(null);
  const youtubeStateRef = useRef('');

  const onChangeFullscreen = event => {
    console.log('onChangeFullscreen', event);
    if (Platform.OS === 'android') {
      if (!event.isFullscreen) {
        setState(prevState => ({ ...prevState, fullscreen: event.isFullscreen }));
      }
    }
  };

  const onYouTubeChangeState = event => {
    console.log(event);
    if (Platform.OS === 'android') {
      if (event.state === 'playing' && !state.fullscreen) {
        if (youtubeStateRef.current !== 'playing') {
          setState(prevState => ({ ...prevState, fullscreen: true }));
          youtubeStateRef.current = event.state;
        } else {
          youtubeStateRef.current = 'stopped';
        }
      }
    }
  };

  const render = () => {
    if (videoId) {
      return (
        <View style={styles.container}>
          <Youtube
            play={false}
            ref={youtubeRef}
            videoId={videoId}
            apiKey={YOUTUBE_API_KEY}
            fullscreen={state.fullscreen}
            onChangeState={onYouTubeChangeState}
            onChangeFullscreen={onChangeFullscreen}
            style={styles.youtube}
            origin={'https://www.legit9ja.com'}
          />
        </View>
      );
    }
    return null;
  };

  return render();
};

export default memo(YouTube);

const styles = StyleSheet.create({
  container: { width: '100%', aspectRatio: 16 / 9 },
  youtube: { flex: 1, margin: 4 },
});
