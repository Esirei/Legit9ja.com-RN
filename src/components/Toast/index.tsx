import React, { memo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import fonts from '@assets/fonts';
import { currentToastSelector } from '@selectors/toastSelectors';
import { ToastMessage } from '@reducers/toastsReducer';
import { deleteToast } from '@actions/toastsActions';

const toastSelectorEquality = (left: ToastMessage | null, right: ToastMessage | null): boolean => {
  return !!left && !!right && left.id === right.id;
};

const Toast = () => {
  const toast = useSelector(currentToastSelector);
  const dispatch = useDispatch();
  const safeArea = useSafeArea();

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        dispatch(deleteToast(toast.id));
      }, toast.duration);
    }
  }, [dispatch, toast]);

  const renderMessage = () => {
    const { message, position, margin, subtitle } = toast;
    const m = margin + safeArea[position];
    return (
      <View style={[styles.container, { [position]: m }]}>
        <View style={styles.messageContainer}>
          <Text numberOfLines={1} style={styles.message}>
            {message}
          </Text>
          {subtitle && (
            <Text numberOfLines={2} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return toast ? renderMessage() : null;
};

export default memo(Toast);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    right: 56,
    left: 56,
  },
  messageContainer: {
    margin: 16,
    minHeight: 56,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    elevation: 2,
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
  message: {
    fontFamily: fonts.Roboto_Bold,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 14,
  },
  subtitle: {
    fontFamily: fonts.Roboto_Regular,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 12,
  },
  messageAction: {
    fontFamily: fonts.Roboto_Bold,
    color: '#008000',
  },
});
