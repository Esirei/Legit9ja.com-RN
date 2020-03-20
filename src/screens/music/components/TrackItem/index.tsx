import React, { Fragment, memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Touchable from '@components/Touchable';
import TrackOptionsButton from '@screens/music/components/TrackOptionsButton';
import TrackProgressTime from '@screens/music/components/TrackProgressTime';
import { TrackFile } from '@reducers/audioPlayerReducer';
import images from '@assets/images';
import fonts from '@assets/fonts';

interface Props {
  track: TrackFile;
  currentTrackId?: string;
  onPress: (trackId: string) => void;
  options: (track: TrackFile) => void;
}

const TrackItem = ({ track, currentTrackId, onPress, options }: Props) => {
  const active = track.id === currentTrackId;
  const style = undefined;
  return (
    <Fragment>
      <Touchable style={styles.track} onPress={() => onPress(track.id)}>
        <View style={styles.trackArtworkContainer}>
          <FastImage source={{ uri: track.artwork }} style={styles.trackArtwork} />
          {active && (
            <View style={styles.trackArtworkActiveOverlay}>
              <Image source={images['play-circle']} style={styles.activeImage} />
            </View>
          )}
        </View>
        <View style={styles.trackInfo}>
          <Text numberOfLines={1} style={[styles.trackTitle, style]}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={[styles.trackArtist, style]}>
            {track.artist}
          </Text>
        </View>
        {active ? <TrackProgressTime /> : <TrackOptionsButton onPress={() => options(track)} />}
      </Touchable>
      <View style={styles.trackDivider} />
    </Fragment>
  );
};

export default memo(TrackItem);

const styles = StyleSheet.create({
  track: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  trackInfo: {
    flex: 1,
  },
  trackArtworkContainer: {
    marginRight: 16,
    borderRadius: 4,
  },
  trackArtwork: {
    height: 48,
    width: 48,
    borderRadius: 4,
  },
  trackArtworkActiveOverlay: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  trackDivider: {
    marginLeft: 80,
    marginRight: 16,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  activeImage: {
    height: 28,
    width: 28,
    tintColor: '#FFF',
  },
});
