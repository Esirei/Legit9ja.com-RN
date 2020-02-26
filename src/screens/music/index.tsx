import React, { Fragment } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNTrackPlayer from 'react-native-track-player';
import Touchable from '@components/Touchable';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentTrackSelector,
  isPlayingSelector,
  tracksSelector,
} from '@selectors/audioPlayerSelectors';
import { deleteTrack } from '@actions/audioPlayerActions';
import { useSafeArea } from 'react-native-safe-area-context';
import images from '@assets/images';

console.log(RNTrackPlayer);

const activeStyle = (track, currentId) => {
  if (track.id === currentId) {
    return styles.activeTrackText;
  }
};

const prev = () => RNTrackPlayer.skipToPrevious();
const next = () => RNTrackPlayer.skipToNext();

const Music = () => {
  const dispatch = useDispatch();
  const currentTrack = useSelector(currentTrackSelector);
  const tracks = useSelector(tracksSelector);
  const isPlaying = useSelector(isPlayingSelector);
  const safeArea = useSafeArea();

  console.log('Current Track', currentTrack);

  const currentTrackId = currentTrack ? currentTrack.id : '';

  const deleteOnPress = track => dispatch(deleteTrack(track));

  const onPress = id => {
    return RNTrackPlayer.skip(id).then(() => {
      return RNTrackPlayer.play();
    });
  };

  const renderTracks = ({ item }) => (
    <Fragment>
      <Touchable style={styles.track} onPress={() => onPress(item.id)} onLongPress={() => deleteOnPress(item)}>
        <FastImage source={{ uri: item.artwork }} style={styles.trackArtwork} />
        <View>
          <Text style={[styles.trackTitle, activeStyle(item, currentTrackId)]}>{item.title}</Text>
          <Text style={[styles.trackArtist, activeStyle(item, currentTrackId)]}>{item.artist}</Text>
        </View>
      </Touchable>
      <View style={styles.trackDivider} />
    </Fragment>
  );

  const renderCurrentTrack = () => {
    if (currentTrack) {
      return (
        <View style={styles.miniPlayerInfo}>
          <FastImage
            source={{ uri: currentTrack.artwork }}
            style={[styles.trackArtwork, styles.miniPlayerArtwork]}
          />
          <View style={styles.miniPlayerInfoTextContainer}>
            <Text numberOfLines={1} style={styles.trackTitle}>
              {currentTrack.title}
            </Text>
            <Text numberOfLines={1} style={styles.trackArtist}>
              {currentTrack.artist}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const onPressPlayPause = async () => {
    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  };

  return (
    <Fragment>
      <StatusBar />
      <FlatList
        data={tracks}
        renderItem={renderTracks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: safeArea.bottom }}
      />
      <View style={styles.miniPlayer}>
        <View style={styles.miniPlayerTrack}>{renderCurrentTrack()}</View>
        <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={prev}>
          <Image source={images['rewind-left']} style={styles.controlImages} />
        </Touchable>
        <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={onPressPlayPause}>
          <Image
            source={images[isPlaying ? 'pause-circle' : 'play-circle']}
            style={styles.controlImages}
          />
        </Touchable>
        <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={next}>
          <Image source={images['rewind-right']} style={styles.controlImages} />
        </Touchable>
      </View>
    </Fragment>
  );
};

Music.navigationOptions = {
  title: 'Music Library',
};

export default Music;

const styles = StyleSheet.create({
  track: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  trackArtwork: {
    height: 48,
    width: 48,
    marginRight: 16,
    borderRadius: 4,
  },
  trackTitle: {
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 12,
  },
  trackDivider: {
    marginLeft: 80,
    marginRight: 16,
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.54)',
  },
  activeTrackText: {
    color: '#008000',
  },
  miniPlayer: {
    height: 54,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.54)',
    flexDirection: 'row',
  },
  miniPlayerTrack: {
    flex: 1,
  },
  miniPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  miniPlayerArtwork: {
    marginLeft: 2.5,
  },
  miniPlayerInfoTextContainer: {
    flex: 1,
  },
  miniPlayerControl: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImages: {
    height: 36,
    width: 36,
    tintColor: '#008000',
  },
});
