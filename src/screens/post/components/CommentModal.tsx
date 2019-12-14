import React, { memo, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, View, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import Touchable from '@components/Touchable';
import Input from '@components/TextInput';
import images from '@assets/images';
import apiClient from '@api';
import fonts from '@assets/fonts';

const CommentModal = ({ post }) => {
  const [isVisible, setVisibility] = useState(false);
  const [data, setData] = useState(() => ({
    author_name: '',
    author_email: '',
    content: '',
  }));

  const [errors, setErrors] = useState(() => ({
    author_name: false,
    author_email: false,
    content: false,
  }));

  const onPress = () => setVisibility(true);

  const close = () => setVisibility(false);

  const onChange = (name: keyof typeof data, value) => {
    setData(prevState => {
      setErrors(prevState1 => ({ ...prevState1, [name]: !value }));
      return { ...prevState, [name]: value };
    });
  };

  const postComment = () => {
    const error = {};
    let invalid = false;
    Object.keys(data).forEach(value => {
      const hasError = !data[value];
      error[value] = hasError;
      hasError && (invalid = hasError);
    });

    if (invalid) {
      setErrors(error as typeof errors);
      return;
    }

    const { id } = post;
    const query = { post: id, ...data };

    apiClient.post('comments', query).then(value => {
      console.log('Comment sent!', value);
      setData({ author_name: '', author_email: '', content: '' });
      close();
    });
  };

  return (
    <>
      <KeyboardAvoidingView behavior={'position'}>
        <Modal
          isVisible={isVisible}
          onBackdropPress={close}
          onBackButtonPress={close}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          hideModalContentWhileAnimating
          avoidKeyboard={false}>
          <StatusBar backgroundColor={'rgba(0,0,0,0.75)'} />
          <View style={styles.commentContainer}>
            <Text style={styles.title}>Write a Comment</Text>
            <View style={styles.inputsContainer}>
              <Input
                image={images.ic_user_128}
                placeholder={'Name'}
                value={data.author_name}
                onChangeText={text => onChange('author_name', text)}
                error={errors.author_name}
              />
              <Input
                image={images.ic_email_128}
                placeholder={'Email'}
                keyboardType={'email-address'}
                value={data.author_email}
                onChangeText={text => onChange('author_email', text)}
                error={errors.author_email}
              />
              <Input
                image={images.ic_chat_128}
                placeholder={'Comment'}
                multiline
                // numberOfLines={3}
                value={data.content}
                onChangeText={text => onChange('content', text)}
                error={errors.content}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Touchable style={styles.button} onPress={close}>
                <Text style={styles.buttonText}>CANCEL</Text>
              </Touchable>
              <Touchable style={styles.button} onPress={postComment}>
                <Text style={styles.buttonText}>SUBMIT</Text>
              </Touchable>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <View style={styles.fab}>
        <Touchable style={styles.fabTouchable} borderlessBackground onPress={onPress}>
          <Image source={images.ic_chat_bubble_128} style={styles.fabImage} />
        </Touchable>
      </View>
    </>
  );
};

export default memo(CommentModal);

const styles = StyleSheet.create({
  commentContainer: { backgroundColor: '#FFF', borderRadius: 2 },
  title: { color: '#FFF', backgroundColor: '#455A64', padding: 15, fontFamily: fonts.roboto_bold },
  inputsContainer: { marginVertical: 5, marginHorizontal: 10 },
  buttonsContainer: { marginTop: 10, marginBottom: 5, flexDirection: 'row' },
  button: { padding: 10, alignItems: 'center', flex: 1 },
  buttonText: { color: '#008000', fontFamily: fonts.roboto_bold },
  fab: {
    position: 'absolute',
    height: 56,
    width: 56,
    borderRadius: 28,
    bottom: 16,
    right: 16,
    backgroundColor: '#008000',
    elevation: 4,
  },
  fabTouchable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fabImage: { width: 24, height: 24, tintColor: '#FFF' },
});
