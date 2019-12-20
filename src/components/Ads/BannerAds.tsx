import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

interface Props {
  style?: ViewStyle;
}

const BannerAds = ({ style }: Props) => {
  return (
    <View style={style}>
      <BannerAd
        unitId={'ca-app-pub-7723042600622321/3183352336'}
        size={BannerAdSize.SMART_BANNER}
      />
    </View>
  );
};

export default memo(BannerAds);
