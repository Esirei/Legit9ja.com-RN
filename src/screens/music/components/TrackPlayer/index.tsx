import React, { memo, useCallback, useRef } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TrackMiniPlayer, { MiniPlayerHeight } from '../TrackMiniPlayer';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { HeaderWithNotchHeight } from '@helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import TrackSeekSlider from '@screens/music/components/TrackSeekSlider';
import TrackProgressDuration from '@screens/music/components/TrackProgressDuration';
import images from '@assets/images';
import ControlButton from '@screens/music/components/ControlButton';
import RNTrackPlayer from 'react-native-track-player';
import { useSelector } from 'react-redux';
import { isPlayingSelector } from '@selectors/audioPlayerSelectors';
import fonts from '@assets/fonts';

const AnimatedView = Animated.View;
const AnimatedImage = Animated.createAnimatedComponent(Image);

const { height, width } = Dimensions.get('window');

const { interpolate, Extrapolate, timing, add } = Animated;

interface Props {
  track: TrackFile;
  backgroundColor: string;
  style?: ViewStyle;
}

const MaxArtworkSize = width * 0.75;

const prev = () => RNTrackPlayer.skipToPrevious();
const next = () => RNTrackPlayer.skipToNext();

const Test = ({ track, backgroundColor }: Props) => {
  const valueRef = useRef(new Animated.Value(0));
  const safeArea = useSafeArea();

  const miniPlayerOpacity = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const contentOpacity = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  // we want the content to be directly below the header
  const contentHeight = height - HeaderWithNotchHeight(safeArea.top, false);

  const translateY = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [contentHeight, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const artworkSize = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [48, MaxArtworkSize],
    extrapolate: Extrapolate.CLAMP,
  });

  const artworkLeft = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [2.5, (width - MaxArtworkSize) / 2],
    extrapolate: Extrapolate.CLAMP,
  });

  const artworkTop = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [5, MiniPlayerHeight + 48],
    extrapolate: Extrapolate.CLAMP,
  });

  const artworkBorder = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [4, 8],
    extrapolate: Extrapolate.CLAMP,
  });

  const marginTop = add(artworkSize, 16);

  const open = useCallback(() => {
    console.log('onPress open 😎');
    timing(valueRef.current, {
      duration: 250,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  const close = useCallback(() => {
    console.log('onPress close 😎');
    timing(valueRef.current, {
      duration: 250,
      toValue: 0,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const isPlaying = useSelector(isPlayingSelector);

  const playOrPause = useCallback(() => {
    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  }, [isPlaying]);

  const playOrPauseImage = () => images[isPlaying ? 'pause-circle' : 'play-circle'];

  return (
    <>
      <AnimatedView style={[styles.container, { transform: [{ translateY }] }]}>
        <AnimatedView style={{ opacity: miniPlayerOpacity }}>
          <TouchableOpacity onPress={open} activeOpacity={0.9}>
            <TrackMiniPlayer track={track} />
          </TouchableOpacity>
        </AnimatedView>
        <AnimatedView
          style={{
            backgroundColor,
            paddingBottom: safeArea.bottom,
            height: contentHeight,
            opacity: contentOpacity,
          }}>
          <ImageBackground
            source={{ uri: track.artwork }}
            style={[styles.artworkBackground]}
            blurRadius={Platform.OS === 'android' ? 5 : 25}>
            <View style={styles.artworkBackgroundOverlay} />
            <TouchableOpacity onPress={close} style={styles.closeButton}>
              <Image source={images.ic_arrow_right_128} style={styles.closeImage} />
            </TouchableOpacity>
            <AnimatedView style={[styles.info, { marginTop }]}>
              <Text numberOfLines={1} style={styles.trackTitle}>
                {track.title}
              </Text>
              <Text numberOfLines={1} style={styles.trackArtist}>
                {track.artist}
              </Text>
              <TrackSeekSlider />
              <TrackProgressDuration />
              <View style={styles.controls}>
                <ControlButton
                  onPress={prev}
                  image={images['rewind-left']}
                  imageStyle={styles.controlImage}
                />
                <ControlButton
                  onPress={playOrPause}
                  image={playOrPauseImage()}
                  imageStyle={styles.controlImage}
                />
                <ControlButton
                  onPress={next}
                  image={images['rewind-right']}
                  imageStyle={styles.controlImage}
                />
              </View>
            </AnimatedView>
          </ImageBackground>
        </AnimatedView>
        <AnimatedImage
          source={{ uri: track.artwork }}
          style={[
            styles.artwork,
            {
              width: artworkSize,
              height: artworkSize,
              top: artworkTop,
              left: artworkLeft,
              borderRadius: artworkBorder,
            },
          ]}
        />
      </AnimatedView>
    </>
  );
};

export default memo(Test);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
  },
  artwork: {
    position: 'absolute',
    aspectRatio: 1,
  },
  info: {
    marginHorizontal: 16,
  },
  closeButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  closeImage: {
    tintColor: '#FFF',
    transform: [{ rotate: '90deg' }],
    height: 24,
    width: 24,
  },
  trackTitle: {
    fontSize: 16,
    fontFamily: fonts.Roboto_Bold,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 14,
    fontFamily: fonts.NeoSansPro_Regular,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
    marginVertical: 8,
  },
  controls: {
    marginTop: 16,
    height: 64,
    width: '75%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlImage: {
    width: 56,
    height: 56,
  },
  artworkBackground: {
    flex: 1,
  },
  artworkBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
