import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import RNTrackPlayer from 'react-native-track-player';
import { useSelector } from 'react-redux';
import TrackProgressLine from '../TrackProgressLine';
import ControlButton from '../ControlButton';
import images from '@assets/images';
import { isPlayingSelector } from '@selectors/audioPlayerSelectors';
import { TrackFile } from '@reducers/audioPlayerReducer';
import FastImage from 'react-native-fast-image';
import fonts from '@assets/fonts';

interface Props {
  track?: TrackFile;
}

const prev = () => RNTrackPlayer.skipToPrevious();
const next = () => RNTrackPlayer.skipToNext();

const TrackMiniPlayer = ({ track }: Props) => {
  const safeArea = useSafeArea();
  const isPlaying = useSelector(isPlayingSelector);

  const renderCurrentTrack = useCallback(() => {
    if (track) {
      return (
        <View style={styles.track}>
          <FastImage source={{ uri: track.artwork }} style={styles.trackArtwork} />
          <View style={styles.trackInfoContainer}>
            <Text numberOfLines={1} style={styles.trackTitle}>
              {track.title}
            </Text>
            <Text numberOfLines={1} style={styles.trackArtist}>
              {track.artist}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }, [track]);

  const playOrPause = useCallback(() => {
    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  }, [isPlaying]);

  const playOrPauseImage = () => images[isPlaying ? 'pause-circle' : 'play-circle'];

  return (
    <View style={[styles.container, { paddingBottom: safeArea.bottom }]}>
      <TrackProgressLine />
      <View style={styles.player}>
        <View style={styles.trackContainer}>{renderCurrentTrack()}</View>
        <ControlButton onPress={prev} image={images['rewind-left']} />
        <ControlButton onPress={playOrPause} image={playOrPauseImage()} />
        <ControlButton onPress={next} image={images['rewind-right']} />
      </View>
    </View>
  );
};

export default memo(TrackMiniPlayer);
export const MiniPlayerHeight = 56;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    minHeight: MiniPlayerHeight,
  },
  player: {
    height: 54,
    // backgroundColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackContainer: {
    flex: 1,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  trackTitle: {
    fontSize: 14,
    fontFamily: fonts.Roboto_Bold,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1,
  },
  trackArtist: {
    fontSize: 12,
    fontFamily: fonts.NeoSansPro_Regular,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1,
  },
  trackArtwork: {
    height: 48,
    width: 48,
    borderRadius: 4,
    marginLeft: 2.5,
    marginRight: 8,
  },
  trackInfoContainer: {
    flex: 1,
  },
});
