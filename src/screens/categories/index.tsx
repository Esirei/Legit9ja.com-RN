import React, { useEffect, useState, memo } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Platform } from 'react-native';
import { Placeholder, PlaceholderLine, PlaceholderMedia, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import randMC from 'random-material-color';
import apiClient from '@api';
import Touchable from '@components/Touchable';
import SeparatorHorizontal from '@components/SeparatorHorizontal';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';
import fonts from '@assets/fonts';
import { data } from '@helpers/api';

const onCategoryItemPress = category => {
  NavigationService.navigate(RouteNames.CATEGORY_POSTS, { category });
};

const code = () => Math.floor(Math.random() * 256);
const getColor = () => `rgb(${code()}, ${code()}, ${code()})`;

const PlaceHolder = () => {
  const renderPlaceHolders = () => {
    return Array.from({ length: 15 }).map(_ => (
      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
        <PlaceholderMedia style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 10 }} />
        <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
          <PlaceholderLine width={35} />
          <PlaceholderLine height={10} width={20} />
        </View>
      </View>
    ));
  };

  return <Placeholder Animation={Fade}>{renderPlaceHolders()}</Placeholder>;
};

// @ts-ignore
const CategoryItem = memo(({ category }) => {
  const hasPost = category.count > 0;
  return (
    <Touchable onPress={() => onCategoryItemPress(category)}>
      <View style={styles.categoryItem}>
        <View style={[styles.categoryItemLetterContainer, { backgroundColor: randMC.getColor() }]}>
          <Text style={styles.categoryItemLetter}>{category.name.charAt(0)}</Text>
        </View>
        <View style={styles.categoryItemDetails}>
          <Text style={styles.categoryTitleText}>{category.name}</Text>
          <Text style={styles.categoryPostCountText}>{category.count} Posts</Text>
        </View>
        {!hasPost && (
          <Image source={images.ic_arrow_right_128} style={styles.subCategoriesIndicator} />
        )}
      </View>
      <SeparatorHorizontal />
    </Touchable>
  );
});

const CategoriesScreen = () => {
  const [state, setState] = useState(() => ({
    categories: [],
    page: 1,
    loading: true,
  }));

  const safeArea = useSafeArea();

  const getCategories = () => {
    const query = { _embed: true, hide_empty: true, per_page: 99 };
    apiClient
      .get('categories', query)
      .then(data)
      .then(categories => setState(prevState => ({ ...prevState, categories, loading: false })));
  };

  // @ts-ignore
  const renderCategories = ({ item }) => <CategoryItem category={item} />;

  const renderFlatList = () => (
    <FlatList
      data={state.categories}
      renderItem={renderCategories}
      contentContainerStyle={{ paddingBottom: safeArea.bottom }}
    />
  );

  useEffect(getCategories, []);

  return <View>{state.loading ? <PlaceHolder /> : renderFlatList()}</View>;
};

CategoriesScreen.navigationOptions = {
  title: 'Categories',
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  categoryItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItemLetterContainer: {
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryItemLetter: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: fonts.NeoSansPro_Medium,
    marginBottom: Platform.OS === 'ios' ? -8 : 0, // font issue on iOS
  },
  categoryItemDetails: {
    marginLeft: 5,
    flex: 1,
  },
  categoryTitleText: {
    fontSize: 16,
    color: '#37474F',
    fontFamily: fonts.NeoSansPro_Regular,
  },
  categoryPostCountText: {
    fontSize: 14,
    color: '#818181',
    fontFamily: fonts.Roboto_Regular,
  },
  subCategoriesIndicator: {
    height: 18,
    width: 18,
    tintColor: '#008000',
  },
});
