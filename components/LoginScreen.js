import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from './Context';
//import firebase from 'firebase';
import config from '../config/dbConfig';

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(config.firebaseConfig);
// }

const userList = [
  {
    id: '9c6937e2-2324-4dc8-97a9-4661fd4ea16b',
    userName: 'longluu',
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

export function LoginScreen({navigation}) {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = React.useContext(AuthContext);
  let count = 0;

  function Login(inputUserName, inputPassword) {
    if (inputUserName != '' && inputPassword != '') {
      userList.forEach(element => {
        if (inputUserName == element.userName) {
          if (inputPassword == element.password) {
            element.activeState = true;
            count++;
            signIn(element.userName);
          }
        }
      });
      if (count == 0) {
        Alert.alert(
          'Đăng nhập không thành công',
          'Sai tài khoản hoặc mật khẩu',
        );
      }
    } else {
      count = 0;
      alert('Tài khoản mật khẩu không được trống');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ĐĂNG NHẬP</Text>
      {/* r */}
      <Text style={styles.content1}>Email</Text>
      <Input
        textContentType="username"
        numberOfLines={1}
        autoCorrect={false}
        leftIcon={{type: 'font-awesome', name: 'user'}}
        onChangeText={setLoginName}
        value={loginName}
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

      <Text style={styles.content2}>Quên mật khẩu?</Text>

      <View style={styles.loginBtn}>
        <Button
          title={'ĐĂNG NHẬP'}
          type={'solid'}
          onPress={() => Login(loginName, password)}></Button>

        <View style={styles.signinBtn}>
          <Button
            title={'ĐĂNG KÝ'}
            type={'outline'}
            onPress={() => {
              navigation.navigate('Signup');
            }}></Button>
        </View>
      </View>
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
  loginBtn: {
    margin: 25,
  },
  signinBtn: {
    marginTop: 15,
    marginBottom: 15,
  },
  anotherLogin: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fbBtn: {
    backgroundColor: '#1877f2',
    alignItems: 'center',
    width: 150,
    borderRadius: 0,
    marginRight: 15,
    marginLeft: 5,
    paddingTop: 2,
  },
  ggBtn: {
    backgroundColor: '#FFFFFF',
    width: 150,
    borderRadius: 0,
  },
});
