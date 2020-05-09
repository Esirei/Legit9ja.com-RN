import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeArea } from 'react-native-safe-area-context';
import Touchable from '@components/Touchable';
import fonts from '@assets/fonts';

interface Props {
  isOpen: boolean;
  close: () => void;
  onDeletePressed: () => void;
  title: string;
  deleteText?: string;
}

const DeleteModal = ({ isOpen, title, close, onDeletePressed, deleteText }: Props) => {
  const safeArea = useSafeArea();

  return (
    <Modal
      isVisible={isOpen}
      onBackButtonPress={close}
      onBackdropPress={close}
      onDismiss={close}
      style={[styles.modal, { paddingBottom: safeArea.bottom }]}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.buttonsWrapper}>
          <Touchable onPress={close} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Touchable>
          <Touchable onPress={onDeletePressed} style={[styles.button, styles.deleteButton]}>
            <Text style={[styles.buttonText, styles.deleteText]}>
              {deleteText ? deleteText : 'Delete'}
            </Text>
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

export default memo(DeleteModal);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
  },
  heading: {
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonsWrapper: {
    flexDirection: 'row',
    height: 48,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    color: 'rgba(0,0,0,0.85)',
    textAlign: 'center',
    fontFamily: fonts.Roboto_Bold,
  },
  buttonText: {
    color: 'rgba(0,0,0,0.75)',
    fontFamily: fonts.Roboto_Bold,
  },
  deleteText: {
    color: '#FFF',
  },
  deleteButton: {
    backgroundColor: '#F15',
  },
});
