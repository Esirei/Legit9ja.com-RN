import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNTrackPlayer, { useProgress } from 'react-native-track-player';
import Touchable from '@components/Touchable';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentTrackSelector,
  isPlayingSelector,
  tracksSelector,
} from '@selectors/audioPlayerSelectors';
import { deleteTrack } from '@actions/audioPlayerActions';
import { useSafeArea } from 'react-native-safe-area-context';
import { HeaderHeight, formatDuration } from '@helpers';
import images from '@assets/images';
import fonts from '@assets/fonts';
import ImageColorPicker from '@components/ImageColorPicker';

const isActive = (track, currentId) => track.id === currentId;

const prev = () => RNTrackPlayer.skipToPrevious();
const next = () => RNTrackPlayer.skipToNext();

const ProgressDuration = () => {
  const progress = useProgress(1000);
  return <Text style={styles.trackDuration}>{formatDuration(progress.position)}</Text>;
};

const Music = () => {
  const dispatch = useDispatch();
  const currentTrack = useSelector(currentTrackSelector);
  const tracks = useSelector(tracksSelector);
  const isPlaying = useSelector(isPlayingSelector);
  const safeArea = useSafeArea();

  useEffect(() => {

  }, []);

  console.log('Current Track', currentTrack);

  const currentTrackId = currentTrack ? currentTrack.id : '';

  const deleteOnPress = track => dispatch(deleteTrack(track));

  const onPress = id => {
    return RNTrackPlayer.skip(id).then(() => {
      return RNTrackPlayer.play();
    });
  };

  const [color, setColor] = useState('#008000');

  const renderTracks = ({ item }) => {
    const style = isActive(item, currentTrackId) ? { color } : undefined;
    return (
      <Fragment>
        <Touchable style={styles.track} onPress={() => onPress(item.id)} onLongPress={() => deleteOnPress(item)}>
          <FastImage source={{ uri: item.artwork }} style={styles.trackArtwork} />
          <View style={styles.trackInfo}>
            <Text numberOfLines={1} style={[styles.trackTitle, style]}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={[styles.trackArtist, style]}>
              {item.artist}
            </Text>
          </View>
          {isActive(item, currentTrackId) && <ProgressDuration />}
        </Touchable>
        <View style={styles.trackDivider} />
      </Fragment>
    );
  };

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

  const pressPlayPause = async () => {
    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  };

  const uri = currentTrack ? currentTrack.artwork : '';

  return (
    <Fragment>
      <StatusBar translucent={false} />
      <ImageBackground source={{ uri }} style={styles.imageBackground} blurRadius={100}>
        <Image source={{ uri }} style={styles.imageBackground2} blurRadius={5} />
        <ImageColorPicker artwork={uri} callback={setColor} reverse />
        <FlatList
          data={tracks}
          style={{ marginTop: HeaderHeight(true) }}
          renderItem={renderTracks}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: safeArea.bottom }}
        />
        <View style={styles.miniPlayer}>
          <View style={styles.miniPlayerTrack}>{renderCurrentTrack()}</View>
          <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={prev}>
            <Image source={images['rewind-left']} style={styles.controlImages} />
          </Touchable>
          <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={pressPlayPause}>
            <Image
              source={images[isPlaying ? 'pause-circle' : 'play-circle']}
              style={styles.controlImages}
            />
          </Touchable>
          <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={next}>
            <Image source={images['rewind-right']} style={styles.controlImages} />
          </Touchable>
        </View>
      </ImageBackground>
    </Fragment>
  );
};

Music.navigationOptions = {
  headerStyle: {
    elevation: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: 'Legit9ja Music Library',
  headerTransparent: true,
  headerTintColor: '#FFF',
};

export default Music;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  imageBackground2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
  },
  track: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  trackInfo: {
    flex: 1,
  },
  trackArtwork: {
    height: 48,
    width: 48,
    marginRight: 16,
    borderRadius: 4,
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
  trackDuration: {
    fontSize: 12,
    fontFamily: fonts.Roboto_Bold,
    color: '#FFF',
  },
  trackDivider: {
    marginLeft: 80,
    marginRight: 16,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  miniPlayer: {
    height: 54,
    backgroundColor: 'rgba(0,0,0,0.25)',
    // backgroundColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
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
    height: 28,
    width: 28,
    tintColor: '#FFF',
  },
});
