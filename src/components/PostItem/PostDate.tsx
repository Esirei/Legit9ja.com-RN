import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import images from '@assets/images';
import moment from 'moment';
import fonts from '@assets/fonts';

const PostDate = ({ post }) => (
  <View style={styles.container}>
    <Image source={images.ic_clock_64} style={styles.icon} />
    <Text style={styles.date}>{moment(post.date).format('DD MMM, YYYY')}</Text>
  </View>
);

export default memo(PostDate);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 12,
    width: 12,
    tintColor: 'rgba(0,0,0,0.54)',
  },
  date: {
    marginLeft: 5,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 12,
    fontFamily: fonts.RobotoRegular,
  },
});
