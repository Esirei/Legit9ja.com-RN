import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

const PlaceHolder = ({ imageHeight, imageWidth }) => {
  const renderInfoPlaceholder = () => {
    return (
      <View style={styles.infoContainer}>
        <PlaceholderLine width={66} />
        <PlaceholderLine width={45} height={10} />
        <View style={styles.dateButtonContainer}>
          <PlaceholderLine width={20} height={10} />
          <View style={styles.buttonsContainer}>
            <PlaceholderMedia style={styles.button} />
            <PlaceholderMedia style={styles.button} />
          </View>
        </View>
      </View>
    );
  };

  const renderContentPlaceholder = () => {
    const array = Array.from({ length: 10 });
    return (
      <View style={styles.contentContainer}>
        {array.map((_, i) => (
          <PlaceholderLine key={i} />
        ))}
        <PlaceholderLine width={75} />
      </View>
    );
  };

  return (
    <Placeholder Animation={Fade}>
      <PlaceholderMedia style={{ height: imageHeight, width: imageWidth }} />
      {renderInfoPlaceholder()}
      {renderContentPlaceholder()}
    </Placeholder>
  );
};

export default PlaceHolder;

const styles = StyleSheet.create({
  infoContainer: {
    margin: 8,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    height: 24,
    width: 24,
    margin: 6,
    marginRight: 14,
  },
  contentContainer: {
    margin: 16,
  },
});
