import React, { Fragment } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Touchable from '@components/Touchable';
import { fileSize } from '@helpers';
import { Download } from '@reducers/downloadsReducer';
import { downloadsSelector } from '@selectors/downloadsSelector';
import { startMP3Download } from '@actions/downloadsActions';
import fonts from '@assets/fonts';

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
  const resumeDownload = url => dispatch(startMP3Download(url));
  const renderDownloads = ({ item }) => (
    <Touchable style={styles.download} onPress={() => resumeDownload(item.url)}>
      <Text numberOfLines={1} style={styles.downloadNameText}>
        {item.name || item.url}
      </Text>
      <View style={styles.downloadInfoContainer}>
        <Text style={styles.downloadPercentText}>{downloadPercent(item)}</Text>
        <Text style={styles.downloadStateText}>{downloadState(item)}</Text>
      </View>
    </Touchable>
  );

  return (
    <Fragment>
      <StatusBar translucent={false} />
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
    borderColor: 'rgba(0,0,0,0.25)',
  },
  downloadInfoContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  downloadNameText: {
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Bold,
  },
  downloadPercentText: {
    flex: 2,
    fontSize: 12,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Regular,
  },
  downloadStateText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Regular,
  },
});
