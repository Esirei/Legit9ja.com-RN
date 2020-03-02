import React, { FC, memo } from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize, FirebaseAdMobTypes } from '@react-native-firebase/admob';

interface Props {
  style?: ViewStyle;
  size?: keyof FirebaseAdMobTypes.BannerAdSize;
}

const unitId = Platform.select({
  android: 'ca-app-pub-7723042600622321/3183352336',
  ios: 'ca-app-pub-7723042600622321/7718530463',
});

const BannerAds: FC<Props> = ({ style, size }) => {
  return (
    <View style={style}>
      <BannerAd unitId={unitId} size={size} />
    </View>
  );
};

BannerAds.defaultProps = {
  size: BannerAdSize.SMART_BANNER,
};

export default memo(BannerAds);
