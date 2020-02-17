import React, { memo } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Touchable from '@components/Touchable';
import SeparatorHorizontal from '@components/SeparatorHorizontal';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';
import fonts from '@assets/fonts';
import config from '@config';

const { navigate, closeDrawer, currentRouteName, navToWeb } = NavigationService;

const DrawerItem = ({ name, icon, onPress, selected = false }) => {
  const style = {
    container: { backgroundColor: '#E0E0E0' },
    icon: { tintColor: '#008000' },
    text: { color: '#008000' },
  };
  return (
    <Touchable style={[styles.drawerItem, selected && style.container]} onPress={onPress}>
      <Image source={icon} style={[styles.drawerItemImage, selected && style.icon]} />
      <Text style={[styles.drawerItemText, selected && style.text]}>{name}</Text>
    </Touchable>
  );
};

const DrawerItemsContainer = ({ name = '', children }) => (
  <View style={styles.drawerItemsContainer}>
    {!!name && <Text style={styles.drawerItemsContainerText}>{name}</Text>}
    {children}
    <SeparatorHorizontal style={styles.drawerItemsContainerSeparator} />
  </View>
);

const Drawer = () => {
  const safeArea = useSafeArea();

  const onPressAppNav = route => {
    navigate(route);
  };

  const renderAppNavItems = () => {
    const items = [
      { name: 'Home', route: RouteNames.HOME, icon: images.ic_home_128 },
      { name: 'Categories', route: RouteNames.CATEGORIES, icon: images.ic_menu_128 },
      { name: 'Bookmarks', route: RouteNames.BOOKMARKS, icon: images.ic_bookmark_marked_128 },
    ];

    return items.map(({ route, ...rest }, i) => (
      <DrawerItem
        key={i}
        onPress={() => onPressAppNav(route)}
        selected={currentRouteName() === route}
        {...rest}
      />
    ));
  };

  const onPressSocialNav = name => {
    switch (name) {
      case 'Facebook':
        const fbUrl = 'https://www.facebook.com/legit9jablog';
        const fbApp = `fb://facewebmodal/f?href=${fbUrl}`;
        Linking.canOpenURL(fbApp).then(canOpen => {
          const url = canOpen ? fbApp : fbUrl;
          Linking.openURL(url).then(closeDrawer);
        });
        break;
      case 'Youtube':
        Linking.openURL('https://www.youtube.com/c/LEGIT9JA%20').then(closeDrawer);
        break;
      case 'Twitter':
        const twitterApp = 'twitter://user?user_id=2786122147';
        const twitterUrl = 'https://twitter.com/Legit_9ja';
        Linking.canOpenURL(twitterApp).then(canOpen => {
          const url = canOpen ? twitterApp : twitterUrl;
          Linking.openURL(url).then(closeDrawer);
        });
        break;
      case 'Instagram':
        Linking.openURL('https://www.instagram.com/legit9ja').then(closeDrawer);
        break;
      default:
        break;
    }
  };

  const renderSocialNavItems = () => {
    const items = [
      { name: 'Facebook', icon: images.ic_round_facebook_128 },
      { name: 'Youtube', icon: images.ic_round_youtube_128 },
      { name: 'Twitter', icon: images.ic_round_twitter_128 },
      { name: 'Instagram', icon: images.ic_instagram_128 },
    ];

    return items.map((item, i) => (
      <DrawerItem key={i} onPress={() => onPressSocialNav(item.name)} {...item} />
    ));
  };

  const onPressOtherNav = name => {
    switch (name) {
      case 'Settings':
        navigate(RouteNames.SETTINGS);
        break;
      case 'Terms & Condition':
        navToWeb({ title: name, url: config.terms_url });
        break;
      case 'Privacy Policy':
        navToWeb({ title: name, url: config.privacy_url });
        break;
      default:
        console.error('Unknown route', name);
    }
  };

  const renderOthersNavItems = () => {
    const items = [
      // { name: 'Settings', icon: images.ic_settings_128 },
      { name: 'Terms & Condition', icon: images.ic_terms_128 },
      { name: 'Privacy Policy', icon: images.ic_privacy_128 },
    ];

    return items.map(({ name, icon }, i) => (
      <DrawerItem
        key={i}
        onPress={() => onPressOtherNav(name)}
        selected={false}
        name={name}
        icon={icon}
      />
    ));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: safeArea.bottom }}>
      <View style={[styles.drawerHeader, { paddingTop: safeArea.top }]}>
        <Image source={images.logo} style={styles.drawerHeaderImage} resizeMode={'cover'} />
      </View>
      <DrawerItemsContainer>{renderAppNavItems()}</DrawerItemsContainer>
      <DrawerItemsContainer name={'Social'}>{renderSocialNavItems()}</DrawerItemsContainer>
      <DrawerItemsContainer name={'Others'}>{renderOthersNavItems()}</DrawerItemsContainer>
    </ScrollView>
  );
};

export default memo(Drawer);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  drawerItemImage: {
    marginLeft: 16,
    marginRight: 32,
    width: 24,
    height: 24,
    tintColor: 'rgba(0,0,0,0.54)',
  },
  drawerItemText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Bold,
  },
  drawerItemsContainer: {
    paddingTop: 8,
    backgroundColor: '#F0F0F0',
  },
  drawerItemsContainerText: {
    fontSize: 13,
    margin: 16,
    marginTop: 8,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.NeoSansPro_Medium,
    marginBottom: Platform.OS === 'ios' ? 8 : 0, // font issue on iOS
  },
  drawerItemsContainerSeparator: {
    marginTop: 8,
    marginHorizontal: 0,
  },
  drawerHeader: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerHeaderImage: {
    flex: 1,
    width: '66%',
    height: undefined,
  },
});
