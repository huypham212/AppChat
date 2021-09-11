import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import firebase from 'firebase';
import uuid from 'react-native-uuid';
import config from '../config/dbConfig';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config.firebaseConfig);
}

const userList = [
  {
    id: '9c6937e2-2324-4dc8-97a9-4661fd4ea16b',
    userName: 'HoangTuGio',
    password: 'long1234',
    activeState: false,
  },
  {
    id: 'c8b3cb69-c607-44ad-aeb1-7c7cf2385606',
    userName: 'GinPham',
    password: 'gin1234',
    activeState: false,
  },
  {
    id: '12ade2b2-5a3b-44c1-834e-e78ebdc9be74',
    userName: 'HaiThu',
    password: 'hai1234',
    activeState: false,
  },
];

export function SignUpScreen() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cfrPassword, setCfrPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  function SignUp(inputUserName, inputEmail, inputPassword) {
    if (inputEmail == '') {
      setErrorEmail('Email không được trống');
    } else {
      if (inputPassword <= 6) {
        alert('Password must have 6 characters!');
      } else {
        if (inputPassword != cfrPassword) {
          alert("Password dosen't matched!");
        } else {
          try {
            firebase
              .auth()
              .createUserWithEmailAndPassword(inputEmail, inputPassword)
              .then(user => {
                if (user == null) {
                  alert('Sign up failed!');
                } else {
                  let uid = uuid.v4();
                  if (inputUserName == '') {
                    try {
                      firebase
                        .database()
                        .ref('user/' + uid)
                        .set({
                          email: inputEmail,
                          username: inputEmail,
                          password: inputPassword,
                          friendList: [],
                          stateActive: false,
                        });
                    } catch (error) {
                      alert(error);
                    }

                    alert('Sign up successed!');
                  } else {
                    try {
                      firebase
                        .database()
                        .ref('user/' + uid)
                        .set({
                          email: inputEmail,
                          username: inputUserName,
                          password: inputPassword,
                          friendList: [],
                          stateActive: false,
                        });
                    } catch (error) {
                      alert(error);
                    }

                    alert('Sign up successed!');
                  }
                }
              });
          } catch (error) {
            alert(error);
          }
        }
      }
    }
  }
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}>
        <Text style={styles.header}>ĐĂNG KÝ</Text>

        <Text style={styles.content1}>Tên đăng nhập</Text>
        <Input
          textContentType="nickname"
          numberOfLines={1}
          autoCorrect={false}
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={setUserName}
          value={userName}
        />

        <Text style={styles.content1}>Email</Text>
        <Input
          textContentType="emailAddress"
          numberOfLines={1}
          autoCompleteType="email"
          autoCorrect={false}
          leftIcon={{type: 'font-awesome', name: 'envelope'}}
          onChangeText={setUserEmail}
          value={userEmail}
          errorMessage={errorEmail}
        />

        <Text style={styles.content1}>Mật khẩu</Text>
        <Input
          textContentType="password"
          secureTextEntry={true}
          numberOfLines={1}
          autoCorrect={false}
          placehoder="Password"
          leftIcon={{type: 'font-awesome', name: 'lock'}}
          rightIcon={{type: 'font-awesome', name: 'eye'}}
          onChangeText={setPassword}
          value={password}
        />

        <Text style={styles.content1}>Xác nhận mật khẩu</Text>
        <Input
          textContentType="password"
          secureTextEntry={true}
          numberOfLines={1}
          placehoder="Confirm password"
          leftIcon={{type: 'font-awesome', name: 'lock'}}
          rightIcon={{type: 'font-awesome', name: 'eye'}}
          onChangeText={setCfrPassword}
          value={cfrPassword}
        />

        <View style={styles.signinBtn}>
          <Button
            title={'ĐĂNG KÝ'}
            type={'outline'}
            onPress={() => SignUp(userName, userEmail, password)}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0, //giúp nội dung không bị che bởi camera trên android
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 140,
  },
  content1: {
    fontSize: 20,
    color: 'black',
    paddingTop: 15,
  },
  content2: {
    fontSize: 15,
    color: 'black',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  input: {
    height: 40,
    fontSize: 18,
    padding: 10,
    marginBottom: 15,
  },
  // loginBtn: {
  //   margin: 25,
  // },
  signinBtn: {
    marginTop: 15,
  },
});
