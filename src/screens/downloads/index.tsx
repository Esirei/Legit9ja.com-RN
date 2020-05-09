import React, { useCallback, useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Touchable from '@components/Touchable';
import NotifyCard from '@components/NotifyCard';
import DeleteModal from '@components/DeleteModal';
import DownloadOptionsMenu from './components/DownloadOptionsMenu';
import { fileSize } from '@helpers';
import { Download } from '@reducers/downloadsReducer';
import { downloadsSelector } from '@selectors/downloadsSelector';
import {
  clearCompletedDownloads,
  deleteDownload,
  pauseDownload,
  startMP3Download,
} from '@actions/downloadsActions';
import fonts from '@assets/fonts';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';

const downloadPercent = (download: Download): string => {
  const { completed, received, total } = download;
  const percent = (completed ? 100 : Math.floor((received / total) * 100)) + '%';
  const size = fileSize(total);
  return `${percent} of ${size}`;
};

const downloadState = (download: Download): string => {
  if (download.completed) {
    return 'Completed';
  } else if (download.isDownloading) {
    return download.speed;
  }
  return 'Paused';
};

const DownloadsScreen = () => {
  const downloads = useSelector(downloadsSelector);
  const safeArea = useSafeArea();
  const dispatch = useDispatch();
  const resume = useCallback(url => dispatch(startMP3Download(url)), [dispatch]);
  const pause = useCallback(url => dispatch(pauseDownload(url)), [dispatch]);
  const clear = useCallback(() => dispatch(clearCompletedDownloads()), [dispatch]);
  const deleteD = useCallback(url => dispatch(deleteDownload(url)), [dispatch]);

  // Selected download to delete url
  const [deletingDownload, setDeletingDownload] = useState<Download | undefined>(undefined);

  const onDelete = useCallback(() => {
    deletingDownload && deleteD(deletingDownload.url);
    setDeletingDownload(undefined);
  }, [deleteD, deletingDownload]);

  const closeDeleteModal = useCallback(() => {
    setDeletingDownload(undefined);
  }, []);

  const _renderDownloadControl = download => {
    const { isDownloading, url } = download;
    return (
      <Touchable
        style={styles.downloadControlButton}
        borderlessBackground
        onPress={() => (isDownloading ? pause(url) : resume(url))}>
        <Image
          source={isDownloading ? images['pause-circle'] : images['play-circle']}
          style={styles.downloadControlImage}
        />
      </Touchable>
    );
  };

  const renderDownloads = ({ item }) => {
    return (
      <View style={styles.download}>
        <View style={styles.downloadInfo}>
          <Text numberOfLines={1} style={styles.downloadNameText}>
            {item.name || item.url}
          </Text>
          <View style={styles.downloadMeta}>
            <Text style={styles.downloadPercentText}>{downloadPercent(item)}</Text>
            <Text style={styles.downloadStateText}>{downloadState(item)}</Text>
          </View>
        </View>
        {/*{_renderDownloadControl(item)}*/}
        <DownloadOptionsMenu
          download={item}
          onPause={pause}
          onResume={resume}
          onDelete={setDeletingDownload}
        />
      </View>
    );
  };

  const renderClearButton = () => {
    if (downloads.length > 0) {
      return (
        <Touchable onPress={clear} style={styles.clearCompletedButton}>
          <Text style={styles.clearCompletedText}>Clear Completed</Text>
        </Touchable>
      );
    }
  };

  const emptyList = () => (
    <NotifyCard
      text={'No downloads have been added'}
      onPress={() => NavigationService.navigate(RouteNames.HOME)}
      type={'warning'}
    />
  );

  const renderList = () => {
    if (downloads.length === 0) {
      return emptyList();
    }
    return (
      <FlatList
        data={downloads}
        renderItem={renderDownloads}
        keyExtractor={item => item.url}
        ListEmptyComponent={emptyList}
      />
    );
  };

  return (
    <>
      <View style={[styles.container, { paddingBottom: safeArea.bottom }]}>
        <StatusBar translucent={false} />
        {renderList()}
        {renderClearButton()}
      </View>
      <DeleteModal
        isOpen={!!deletingDownload}
        close={closeDeleteModal}
        onDeletePressed={onDelete}
        title={deletingDownload ? `Delete ${deletingDownload.name}` : ''}
      />
    </>
  );
};

DownloadsScreen.navigationOptions = {
  title: 'Downloads',
};

export default DownloadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  download: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  downloadMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  downloadNameText: {
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Bold,
  },
  downloadPercentText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Regular,
  },
  downloadStateText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Regular,
  },
  clearCompletedButton: {
    margin: 8,
    minHeight: 40,
    borderRadius: 4,
    justifyContent: 'center',
    backgroundColor: '#008000',
  },
  clearCompletedText: {
    color: '#FFF',
    fontFamily: fonts.Roboto_Bold,
    textAlign: 'center',
  },
  downloadControlButton: {
    height: 54,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadControlImage: {
    height: 28,
    width: 28,
    tintColor: 'rgba(0,0,0,0.54)',
  },
});
