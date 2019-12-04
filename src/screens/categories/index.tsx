import React, { useEffect, useState, memo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import randMC from 'random-material-color';
import apiClient from '@api';
import Touchable from '@components/Touchable';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';

const onCategoryItemPress = category => {
  NavigationService.navigate(RouteNames.CATEGORY_POSTS, { category });
};

const code = () => Math.floor(Math.random() * 256);
const getColor = () => `rgb(${code()}, ${code()}, ${code()})`;

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
      <View style={styles.categoryItemSeparator} />
    </Touchable>
  );
});

const CategoriesScreen = () => {
  const [state, setState] = useState(() => ({
    categories: [],
    page: 1,
    loading: true,
  }));

  const getCategories = () => {
    const query = { _embed: true, hide_empty: true, per_page: 99 };
    apiClient
      .get('categories', query)
      .then(categories => setState(prevState => ({ ...prevState, categories })));
  };

  // @ts-ignore
  const renderCategories = ({ item }) => <CategoryItem category={item} />;

  useEffect(getCategories, []);

  return <FlatList data={state.categories} renderItem={renderCategories} />;
};

CategoriesScreen.navigationOptions = {
  title: 'Categories',
};

export default CategoriesScreen;
export { default as CategoryPostsScreen } from './CategoryPostsScreen';

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
  },
  categoryItemDetails: {
    marginLeft: 5,
    flex: 1,
  },
  categoryTitleText: {
    fontSize: 16,
    color: '#37474F',
  },
  categoryPostCountText: {
    fontSize: 14,
    color: '#818181',
  },
  subCategoriesIndicator: {
    height: 18,
    width: 18,
    tintColor: '#008000',
  },
  categoryItemSeparator: {
    height: 0.3,
    backgroundColor: '#818181',
    marginHorizontal: 8,
  },
});
