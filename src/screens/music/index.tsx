import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
import { formatDuration, HeaderHeight } from '@helpers';
import images from '@assets/images';
import fonts from '@assets/fonts';
import NotifyCard from '@components/NotifyCard';
import ImageColorPicker from '@components/ImageColorPicker';
import DeleteTrackModal from '@screens/music/components/DeleteTrackModal';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { NavigationService, RouteNames } from '@navigation';

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

  useEffect(() => {}, []);

  console.log('Current Track', currentTrack);

  const currentTrackId = currentTrack ? currentTrack.id : '';

  const onPress = id => {
    return RNTrackPlayer.skip(id).then(() => {
      return RNTrackPlayer.play();
    });
  };

  const [color, setColor] = useState('rgba(0,0,0,0.25)');
  const [selectedTrack, setSelectedTrack] = useState<TrackFile | undefined>(undefined);

  const onLongPressTrack = useCallback(
    (track: TrackFile) => {
      if (currentTrackId !== track.id) {
        setSelectedTrack(track);
      }
    },
    [currentTrackId],
  );

  const deleteOnPress = useCallback(() => {
    selectedTrack && dispatch(deleteTrack(selectedTrack));
    setSelectedTrack(undefined);
  }, [selectedTrack, dispatch]);

  const closeModal = useCallback(() => setSelectedTrack(undefined), []);

  const renderTracks = ({ item }) => {
    const active = isActive(item, currentTrackId);
    // const style = isActive(item, currentTrackId) ? { color } : undefined;
    const style = undefined;
    return (
      <Fragment>
        <Touchable
          style={styles.track}
          onPress={() => onPress(item.id)}
          onLongPress={() => onLongPressTrack(item)}>
          <View style={styles.trackArtworkContainer}>
            <FastImage source={{ uri: item.artwork }} style={styles.trackArtwork} />
            {active && (
              <View style={styles.trackArtworkActiveOverlay}>
                <Image source={images['play-circle']} style={styles.controlImages} />
              </View>
            )}
          </View>
          <View style={styles.trackInfo}>
            <Text numberOfLines={1} style={[styles.trackTitle, style]}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={[styles.trackArtist, style]}>
              {item.artist}
            </Text>
          </View>
          {active && <ProgressDuration />}
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

  const emptyList = () => (
    <NotifyCard
      text={'No songs have been downloaded yet'}
      onPress={() => NavigationService.navigate(RouteNames.HOME)}
      type={'warning'}
    />
  );

  const renderList = () => {
    if (tracks.length === 0) {
      return emptyList();
    }
    return (
      <FlatList
        data={tracks}
        style={{ marginTop: HeaderHeight(true) }}
        renderItem={renderTracks}
        ListEmptyComponent={emptyList}
        keyExtractor={item => item.id}
      />
    );
  };

  return (
    <Fragment>
      <StatusBar translucent={false} />
      <ImageBackground source={{ uri }} style={styles.imageBackground} blurRadius={100}>
        <Image
          source={{ uri }}
          style={[styles.imageBackground2, { backgroundColor: color }]}
          blurRadius={5}
        />
        <ImageColorPicker artwork={uri} callback={setColor} reverse={false} />
        {renderList()}
        <View style={[styles.miniPlayerContainer, { paddingBottom: safeArea.bottom }]}>
          <View style={styles.miniPlayer}>
            <View style={styles.miniPlayerTrack}>{renderCurrentTrack()}</View>
            <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={prev}>
              <Image source={images['rewind-left']} style={styles.controlImages} />
            </Touchable>
            <Touchable
              style={styles.miniPlayerControl}
              borderlessBackground
              onPress={pressPlayPause}>
              <Image
                source={images[isPlaying ? 'pause-circle' : 'play-circle']}
                style={styles.controlImages}
              />
            </Touchable>
            <Touchable style={styles.miniPlayerControl} borderlessBackground onPress={next}>
              <Image source={images['rewind-right']} style={styles.controlImages} />
            </Touchable>
          </View>
        </View>
        <DeleteTrackModal
          track={selectedTrack}
          onDeletePressed={deleteOnPress}
          close={closeModal}
        />
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
  miniPlayerContainer: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  miniPlayer: {
    height: 54,
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
    marginRight: 8,
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
