import React, { memo, useCallback, useRef } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import RNTrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { HeaderWithNotchHeight, next, prev } from '@helpers';
import images from '@assets/images';
import fonts from '@assets/fonts';
import { Repeat, TrackFile } from '@reducers/audioPlayerReducer';
import { repeatTracks, shuffleTracks } from '@actions/audioPlayerActions';
import {
  isPlayingSelector,
  repeatSelector,
  shuffleSelector,
} from '@selectors/audioPlayerSelectors';
import TrackMiniPlayer, { MiniPlayerHeight } from '../TrackMiniPlayer';
import TrackSeekSlider from '../TrackSeekSlider';
import TrackProgressDuration from '../TrackProgressDuration';
import ControlButton from '../ControlButton';
import PlayerModal from './PlayerModal';

const AnimatedView = Animated.View;
const AnimatedImage = Animated.createAnimatedComponent(Image);

const { height, width } = Dimensions.get('window');

const { interpolate, Extrapolate, concat, add } = Animated;

interface Props {
  track: TrackFile;
  backgroundColor: string;
  style?: ViewStyle;
}

const MaxArtworkSize = width * 0.75;

const TrackPlayer = ({ track, backgroundColor }: Props) => {
  const valueRef = useRef(new Animated.Value(0));
  const safeArea = useSafeArea();

  // we want the content to be directly below the header
  const contentHeight = height - HeaderWithNotchHeight(safeArea.top, false);

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
    outputRange: [5, MiniPlayerHeight + 48 + safeArea.bottom], // we want top to be height of miniPlayer + height of close button
    extrapolate: Extrapolate.CLAMP,
  });

  const artworkBorder = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [4, 8],
    extrapolate: Extrapolate.CLAMP,
  });

  const closeRotate = interpolate(valueRef.current, {
    inputRange: [0, 1],
    outputRange: [180, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const marginTop = add(artworkSize, 16);

  const isPlaying = useSelector(isPlayingSelector);

  const playOrPause = useCallback(() => {
    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  }, [isPlaying]);

  const playOrPauseImage = () => images[isPlaying ? 'pause-circle' : 'play-circle'];

  const repeat = useSelector(repeatSelector);
  const shuffle = useSelector(shuffleSelector);
  const dispatch = useDispatch();

  const onPressRepeat = useCallback(() => {
    let r: Repeat;
    switch (repeat) {
      case Repeat.OFF:
        r = Repeat.ALL;
        break;
      case Repeat.ALL:
        r = Repeat.CURRENT;
        if (Platform.OS === 'ios') {
          // r = Repeat.OFF; // Currently iOS doesn't return the correct position which I'm using to calculate if track completed.
        }
        break;
      case Repeat.CURRENT:
      default:
        r = Repeat.OFF;
        break;
    }
    dispatch(repeatTracks(r));
  }, [repeat, dispatch]);

  const onPressShuffle = useCallback(() => {
    dispatch(shuffleTracks());
  }, [dispatch]);

  const repeatOpacity = repeat !== Repeat.OFF ? 1 : 0.5;
  const shuffleOpacity = shuffle ? 1 : 0.5;

  const renderMiniPlayer = () => <TrackMiniPlayer track={track} />;

  const renderPlayer = () => (
    <ImageBackground
      source={{ uri: track.artwork }}
      style={[styles.artworkBackground, { paddingBottom: safeArea.bottom, backgroundColor }]}
      blurRadius={Platform.OS === 'android' ? 5 : 25}>
      <View style={styles.artworkBackgroundOverlay} />
      <View style={styles.closeButton}>
        <AnimatedImage
          source={images['arrowhead-down']}
          style={[styles.closeImage, { transform: [{ rotateX: concat(closeRotate, 'deg') }] }]}
        />
      </View>
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
          <ControlButton onPress={prev} image={images['rewind-left']} size={56} />
          <ControlButton onPress={playOrPause} image={playOrPauseImage()} size={56} />
          <ControlButton onPress={next} image={images['rewind-right']} size={56} />
        </View>
        <View style={styles.controlsII}>
          <ControlButton
            onPress={onPressRepeat}
            image={images.repeat}
            size={24}
            text={repeat === Repeat.CURRENT ? '1' : undefined}
            imageStyle={{ opacity: repeatOpacity }}
          />
          <ControlButton
            onPress={onPressShuffle}
            image={images.shuffle}
            size={24}
            imageStyle={{ opacity: shuffleOpacity }}
          />
        </View>
      </AnimatedView>
    </ImageBackground>
  );

  const renderTrackImage = () => (
    <AnimatedView
      style={[
        styles.artworkContainer,
        {
          width: artworkSize,
          height: artworkSize,
          top: artworkTop,
          left: artworkLeft,
          borderRadius: artworkBorder,
        },
      ]}>
      <Image source={{ uri: track.artwork }} style={styles.artwork} />
    </AnimatedView>
  );

  return (
    <PlayerModal
      miniPlayer={renderMiniPlayer}
      player={renderPlayer}
      artwork={renderTrackImage}
      callbackNode={valueRef.current}
      contentHeight={contentHeight}
    />
  );
};

export default memo(TrackPlayer);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
  },
  artworkContainer: {
    position: 'absolute',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  artwork: {
    height: '100%',
    width: '100%',
  },
  info: {
    marginHorizontal: 16,
  },
  closeButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeImage: {
    tintColor: '#FFF',
    height: 24,
    width: 24,
    opacity: 0.5,
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
  controlsII: {
    height: 56,
    width: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artworkBackground: {
    flex: 1,
  },
  artworkBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
