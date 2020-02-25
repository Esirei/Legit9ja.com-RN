import React, { Fragment } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { downloadsSelector } from '@selectors/downloadsSelector';
import { fileSize } from '@helpers';
import { Download } from '@reducers/downloadsReducer';

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
  const renderDownloads = ({ item }) => (
    <View style={styles.download}>
      <Text numberOfLines={1}>{item.name || item.url}</Text>
      <View style={styles.downloadInfoContainer}>
        <Text style={styles.downloadPercentText}>{downloadPercent(item)}</Text>
        <Text style={styles.downloadStateText}>{downloadState(item)}</Text>
      </View>
    </View>
  );

  return (
    <Fragment>
      <StatusBar />
      <FlatList
        data={downloads}
        renderItem={renderDownloads}
        keyExtractor={item => item.url}
        contentContainerStyle={{ paddingBottom: safeArea.bottom }}
      />
    </Fragment>
  );
};

DownloadsScreen.navigationOptions = {
  title: 'Downloads',
};

export default DownloadsScreen;

const styles = StyleSheet.create({
  download: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.54)',
  },
  downloadInfoContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  downloadPercentText: {
    flex: 2,
    fontSize: 12,
  },
  downloadStateText: {
    flex: 1,
    fontSize: 12,
  },
});
