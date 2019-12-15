import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Post } from '@types';
import fonts from '@assets/fonts';

interface Props {
  post: Post;
}

const Author = ({ post }: Props) => {
  const author = post._embedded.author[0];
  return (
    <View style={styles.container}>
      <FastImage source={{ uri: author.avatar_urls['48'] }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{author.name}</Text>
      </View>
    </View>
  );
};

export default memo(Author);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  image: {
    height: 45,
    width: 45,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 5,
    backgroundColor: '#FFF',
    padding: 3,
    paddingHorizontal: 5,
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 20,
  },
  text: {
    fontFamily: fonts.RobotoBold,
    color: 'rgba(0,0,0,0.75)',
    textAlignVertical: 'center',
    fontSize: 13,
  },
});
