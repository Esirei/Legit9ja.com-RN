import React, { memo, FC } from 'react';
import { View, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize, FirebaseAdMobTypes } from '@react-native-firebase/admob';

interface Props {
  style?: ViewStyle;
  size?: keyof FirebaseAdMobTypes.BannerAdSize;
}

const BannerAds: FC<Props> = ({ style, size }) => {
  return (
    <View style={style}>
      <BannerAd unitId={'ca-app-pub-7723042600622321/3183352336'} size={size} />
    </View>
  );
};

BannerAds.defaultProps = {
  size: BannerAdSize.SMART_BANNER,
};

export default memo(BannerAds);
