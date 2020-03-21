import React, { Fragment, useCallback, useState } from 'react';
import { FlatList, Image, ImageBackground, Platform, StatusBar, StyleSheet } from 'react-native';
import RNTrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import NotifyCard from '@components/NotifyCard';
import ImageColorPicker from '@components/ImageColorPicker';
import { HeaderSearchButton } from '@components/HeaderIconButton';
import { currentTrackSelector, tracksSelector } from '@selectors/audioPlayerSelectors';
import { deleteTrack } from '@actions/audioPlayerActions';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { HeaderWithNotchHeight } from '@helpers';
import DeleteTrackModal from './components/DeleteTrackModal';
import TrackItem from './components/TrackItem';
import { MiniPlayerHeight } from './components/TrackMiniPlayer';
import TrackSearch from './components/TrackSearch';
import TrackPlayer from './components/TrackPlayer';
import { NavigationService, RouteNames } from '@navigation';

type NavigationParams = { search: boolean };

const Music: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentTrack = useSelector(currentTrackSelector);
  const tracks = useSelector(tracksSelector);
  const safeArea = useSafeArea();

  const currentTrackId = currentTrack ? currentTrack.id : '';

  const onPress = useCallback(id => {
    RNTrackPlayer.skip(id).then(() => {
      return RNTrackPlayer.play();
    });
  }, []);

  const [color, setColor] = useState('rgba(0,0,0,0.25)');
  const [selectedTrack, setSelectedTrack] = useState<TrackFile | undefined>(undefined);

  const options = useCallback(
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

  const renderTracks = ({ item }) => (
    <TrackItem track={item} onPress={onPress} options={options} currentTrackId={currentTrackId} />
  );

  const uri = currentTrack ? currentTrack.artwork : '';

  const emptyList = () => (
    <NotifyCard
      text={'No songs have been downloaded yet'}
      onPress={() => NavigationService.navigate(RouteNames.HOME)}
      type={'warning'}
      color={'#FFF'}
    />
  );

  const renderList = () => {
    if (tracks.length === 0) {
      return emptyList();
    }
    const marginTop = HeaderWithNotchHeight(safeArea.top, true);
    const marginBottom = currentTrack ? MiniPlayerHeight + safeArea.bottom : undefined;
    return (
      <FlatList
        data={tracks}
        style={{ marginTop, marginBottom }}
        renderItem={renderTracks}
        ListEmptyComponent={emptyList}
        keyExtractor={item => item.id}
      />
    );
  };

  const search = navigation.getParam('search', false);

  const onCloseSearch = useCallback(() => navigation.setParams({ search: false }), [navigation]);

  return (
    <Fragment>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <ImageBackground source={{ uri }} style={styles.imageBackground} blurRadius={100}>
        <Image
          source={{ uri }}
          style={[styles.imageBackground2, { backgroundColor: color }]}
          blurRadius={Platform.OS === 'android' ? 5 : 25}
        />
        <ImageColorPicker imagePath={uri} callback={setColor} reverse={false} />
        {renderList()}
        {currentTrack && <TrackPlayer track={currentTrack} backgroundColor={color} />}
        <TrackSearch
          onClose={onCloseSearch}
          open={search}
          onPressItem={onPress}
          onItemOptions={options}
          style={{ backgroundColor: color }}
        />
        <DeleteTrackModal
          track={selectedTrack}
          onDeletePressed={deleteOnPress}
          close={closeModal}
        />
      </ImageBackground>
    </Fragment>
  );
};

Music.navigationOptions = ({ navigation }) => {
  const onPress = () => navigation.setParams({ search: true });
  const search = navigation.getParam('search', false);
  return {
    headerStyle: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: 'Music Library',
    headerTransparent: true,
    headerTintColor: '#FFF',
    headerRight: search
      ? undefined
      : () => <HeaderSearchButton tintColor={'#FFF'} onPress={onPress} />,
  };
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
});
