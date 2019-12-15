import React, { memo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Touchable from '@components/Touchable';
import Input from '@components/TextInput';
import images from '@assets/images';
import apiClient from '@api';
import fonts from '@assets/fonts';
import { Post } from '@types';

interface Props {
  post: Post;
  onSubmit?: () => void;
}

const CommentModal = ({ post, onSubmit }: Props) => {
  const [isVisible, setVisibility] = useState(false);
  const [posting, setPosting] = useState(false);
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

    Keyboard.dismiss();

    const { id } = post;
    const query = { post: id, ...data };

    setPosting(true);
    apiClient
      .post('comments', query)
      .then(value => {
        console.log('Comment sent!', value);
        close();
        setData({ author_name: '', author_email: '', content: '' });
        setPosting(false);
        !!onSubmit && onSubmit();
      })
      .catch(_ => {
        setPosting(false);
      });
  };

  const renderPostingIndicator = () => (
    <View style={styles.button}>
      <ActivityIndicator size={'small'} color={'#008000'} />
    </View>
  );

  const renderSubmitButton = () => (
    <Touchable style={styles.button} onPress={postComment}>
      <Text style={styles.buttonText}>SUBMIT</Text>
    </Touchable>
  );

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
                editable={!posting}
                error={errors.author_name}
                autoFocus
              />
              <Input
                image={images.ic_email_128}
                placeholder={'Email'}
                value={data.author_email}
                onChangeText={text => onChange('author_email', text)}
                editable={!posting}
                error={errors.author_email}
                keyboardType={'email-address'}
              />
              <Input
                image={images.ic_chat_128}
                placeholder={'Comment'}
                value={data.content}
                onChangeText={text => onChange('content', text)}
                editable={!posting}
                error={errors.content}
                multiline
                style={styles.commentInput}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Touchable style={styles.button} onPress={close}>
                <Text style={styles.buttonText}>CANCEL</Text>
              </Touchable>
              {posting ? renderPostingIndicator() : renderSubmitButton()}
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
  title: { color: '#FFF', backgroundColor: '#455A64', padding: 15, fontFamily: fonts.Roboto_Bold },
  inputsContainer: { marginVertical: 5, marginHorizontal: 10 },
  commentInput: { maxHeight: 60 },
  buttonsContainer: { marginTop: 10, marginBottom: 5, flexDirection: 'row' },
  button: { padding: 10, alignItems: 'center', flex: 1 },
  buttonText: { color: '#008000', fontFamily: fonts.Roboto_Bold },
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
