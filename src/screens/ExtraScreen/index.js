import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@actions/sessionActions';
import { userSelector, tokenSelector } from '@selectors/sessionSelector';
import { NavigationService, RouteNames } from '@navigation';

const Button = ({ onPress, text, ...props }) => (
  <TouchableOpacity style={[styles.button, props.style]} onPress={onPress} {...props}>
    <Text>{text}</Text>
  </TouchableOpacity>
);

export default () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const token = useSelector(tokenSelector);

  const handleLogin = useCallback(() => dispatch(login('eve.holt@reqres.in', 'cityslicka')), [
    dispatch,
  ]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const returnHome = useCallback(() => NavigationService.navigate(RouteNames.HOME), []);

  const authButton = () => {
    return user && token ? (
      <Button onPress={handleLogout} text={'Logout'} />
    ) : (
      <Button onPress={handleLogin} text={'Login'} />
    );
  };

  const welcomeUser = () => {
    const { first_name, last_name } = user;
    return <Text>{`Welcome to template, ${first_name} ${last_name}`}</Text>;
  };

  return (
    <View style={styles.container}>
      {user && token && welcomeUser()}
      {authButton()}
      <Button onPress={returnHome} text={'Go back to home screen'} style={styles.homeButton} />
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  homeButton: {
    marginTop: 16,
  },
  button: {
    justifyContent: 'center',
    borderColor: '#000',
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 8,
  },
};
