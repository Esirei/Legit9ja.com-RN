import React, { memo, useRef } from 'react';
import { Image, Share, StyleSheet, View } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import Touchable from '@components/Touchable';
import images from '@assets/images';
import PostDate from './PostDate';

const MenuOptionIcon = ({ source }) => <Image source={source} style={styles.menuOptionIcon} />;

const PostMenu = ({ post }) => {
  const menu = useRef<Menu>(null);

  const showMenu = () => {
    !!menu.current && menu.current.show();
  };

  const button = () => (
    <Touchable onPress={showMenu} borderlessBackground>
      <Image source={images.ic_menu_64} style={styles.postMenu} />
    </Touchable>
  );

  const onPress = item => {
    !!menu.current && menu.current.hide();
    switch (item) {
      case 'Share':
        Share.share(
          { title: 'Hello', url: 'http://esirei.com' },
          { dialogTitle: 'Sharing via', subject: 'unknown post', tintColor: 'red' },
        );
        break;
      case 'Save':
        break;
      default:
        break;
    }
  };

  return (
    <Menu ref={menu} button={button()}>
      <MenuItem onPress={() => onPress('Share')}>
        {/*<MenuOptionIcon source={images.ic_share_128} />*/}
        Share
      </MenuItem>
      <MenuItem onPress={() => onPress('Save')}>
        {/*<MenuOptionIcon source={images.ic_bookmark_marked_128} />*/}
        Save
      </MenuItem>
    </Menu>
  );
};

const PostDateMenu = ({ post }) => (
  <View style={styles.container}>
    <PostDate post={post} />
    <PostMenu post={post} />
  </View>
);

export default memo(PostDateMenu);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postMenu: {
    height: 15,
    width: 15,
    tintColor: 'rgba(0,0,0,0.54)',
  },
  menuOptionIcon: {
    width: 16,
    height: 16,
    marginRight: 16,
  },
});
