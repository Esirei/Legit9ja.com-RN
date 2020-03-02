import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AdEventType, InterstitialAd } from '@react-native-firebase/admob';

const unitId = Platform.select({
  android: 'ca-app-pub-7723042600622321/9146125453',
  ios: 'ca-app-pub-7723042600622321/7534358327',
});

const useInterstitialAds = () => {
  useEffect(() => {
    // Create a new instance
    // const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
    const interstitialAd = InterstitialAd.createForAdRequest(
      unitId,
    );

    // Add event handlers
    const unsubscribe = interstitialAd.onAdEvent(type => {
      console.log('New advert event: ', type);
      if (type === AdEventType.LOADED) {
        interstitialAd.show();
      }
    });

    // Load a new advert
    interstitialAd.load();
    return () => {
      unsubscribe();
    };
  }, []);
  return null;
};

export default useInterstitialAds;
