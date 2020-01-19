import { useEffect, memo } from 'react';
import OneSignal from 'react-native-onesignal';
import { NavigationService } from '@navigation';

const onReceived = notification => {
  console.log('Notification Received: ', notification);
};

const onOpened = openResult => {
  console.log('On Open: ', openResult);
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  const data = openResult.notification.payload.additionalData;
  if (data && data.post_id) {
    const post = Number(data.post_id);
    NavigationService.navToPost({ post, source: 'id' });
  }
};

const onIds = device => {
  console.log('Device info: ', device);
};

const NotificationService = () => {
  useEffect(() => {
    console.log('NotificationService started...');
    // OneSignal.init('3ce2bdd0-6576-4130-ba02-7ce21496f4f2'); // TEST
    OneSignal.init('229b254c-8646-4aeb-875c-99d16675676a');
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
    return () => {
      OneSignal.removeEventListener('received', onReceived);
      OneSignal.removeEventListener('opened', onOpened);
      OneSignal.removeEventListener('ids', onIds);
    };
  }, []);
  return null;
};

export default memo(NotificationService);
