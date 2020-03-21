import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { HeaderWithNotchHeight } from '@helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { tracksSelector } from '@selectors/audioPlayerSelectors';
import { TrackFile } from '@reducers/audioPlayerReducer';
import NotifyCard from '@components/NotifyCard';
import TrackItem from '@screens/music/components/TrackItem';
import TextInput from '@components/TextInput';

interface Props {
  open?: boolean;
  onClose: () => boolean;
  style: ViewStyle;
  onPressItem: (trackId: string) => void;
  onItemOptions: (track: TrackFile) => void;
}

const TrackSearch = ({ open, onClose, onPressItem, onItemOptions, style }: Props) => {
  const safeArea = useSafeArea();
  const tracks = useSelector(tracksSelector);
  const searchModal = useRef<Modalize>(null);
  const [data, setData] = useState<TrackFile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const array = tracks.filter(value => {
      return (
        value.artist.toLowerCase().includes(search) || value.title.toLowerCase().includes(search)
      );
    });
    setData(array);
  }, [search, tracks]);

  useEffect(() => {
    const modal = searchModal.current;
    if (modal) {
      if (open) {
        modal.open('default');
      } else {
        modal.close();
      }
    }
  }, [open]);

  const close = useCallback(() => {
    setSearch('');
    return onClose();
  }, [onClose]);

  const renderItem = ({ item }) => (
    <TrackItem track={item} onPress={onPressItem} options={onItemOptions} />
  );

  const emptyList = () => (
    <NotifyCard text={'No search result...'} onPress={close} type={'warning'} color={'#FFF'} />
  );

  const header = () => (
    <TextInput
      onChangeText={text => setSearch(text.toLowerCase())}
      placeholder={'Search...'}
      autoFocus
      containerStyle={styles.searchInputContainer}
      style={styles.searchInput}
      placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
      returnKeyType={'search'}
    />
  );

  return (
    <Modalize
      ref={searchModal}
      HeaderComponent={header()}
      modalStyle={[styles.modal, { marginTop: HeaderWithNotchHeight(safeArea.top, true) }, style]}
      onBackButtonPress={close}
      onOverlayPress={close}
      onClose={close}
      handleStyle={styles.modalHandle}
      avoidKeyboardLikeIOS
      flatListProps={{
        data,
        renderItem,
        ListEmptyComponent: emptyList(),
        keyExtractor: item => item.id,
        contentContainerStyle: {
          paddingBottom: safeArea.bottom,
          flex: data.length === 0 ? 1 : undefined,
        },
      }}
    />
  );
};

export default memo(TrackSearch);

const styles = StyleSheet.create({
  modal: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  modalHandle: {
    height: 0,
  },
  searchInputContainer: {
    minHeight: 30,
    margin: 4,
    marginBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  searchInput: {
    color: '#FFF',
    marginVertical: 4,
  },
});
