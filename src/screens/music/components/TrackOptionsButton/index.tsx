import React, { memo } from 'react';
import OptionsButton from '@components/OptionsButton';

const TrackOptionsButton = ({ onPress }) => (
  <OptionsButton onPress={onPress} backgroundColor={'rgba(0,0,0,0.1)'} tintColor={'#FFF'} />
);

export default memo(TrackOptionsButton);
