import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeArea } from 'react-native-safe-area-context';
import Touchable from '@components/Touchable';
import { TrackFile } from '@reducers/audioPlayerReducer';

interface Props {
  track?: TrackFile;
  close: () => void;
  onDeletePressed: () => void;
  deleteText?: string;
}

const DeleteTrackModal = ({ track, close, onDeletePressed, deleteText }: Props) => {
  const safeArea = useSafeArea();
  const title = () => {
    if (track) {
      let text = `Delete ${track.title}`;
      if (track.artist) {
        text += ` by ${track.artist}`;
      }
      return text;
    }
    return '';
  };

  return (
    <Modal
      isVisible={!!track}
      onBackButtonPress={close}
      onBackdropPress={close}
      onDismiss={close}
      style={[styles.modal, { paddingBottom: safeArea.bottom }]}>
      <View style={styles.deleteModalContent}>
        <View style={styles.modalHeading}>
          <Text>{title()}</Text>
        </View>
        <View style={styles.modalButtonsWrapper}>
          <Touchable onPress={close} style={styles.modalButton}>
            <Text>Cancel</Text>
          </Touchable>
          <Touchable
            onPress={onDeletePressed}
            style={[styles.modalButton, { backgroundColor: '#F15' }]}>
            <Text style={{ color: '#FFF' }}>{deleteText ? deleteText : 'Delete'}</Text>
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

export default memo(DeleteTrackModal);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
  },
  modalHeading: {
    padding: 16,
    minHeight: 100,
  },
  deleteModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalButtonsWrapper: {
    flexDirection: 'row',
    height: 48,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
