import React, {useState, useMemo, useEffect, useContext} from 'react';
import {View, ActivityIndicator, Alert} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {AuthContext} from './components/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {MyStack, RootStack} from './components/Navigation';

//Main
export default function App() {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  // Handle user state changes

  const initLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  function loginReducer(prevState, action) {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'ISLOADING':
        return {
          ...prevState,
          userToken: null,
          isLoading: true,
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState);

  const authContext = useMemo(() => ({
    uid,
    user,
    signIn: async (email, password) => {
      let result = false;
      try {
        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(async user => {
            dispatch({
              type: 'LOGIN',
              token: user.user.uid,
            });
            setUid(user.user.uid);
            await AsyncStorage.setItem('userToken', user.user.uid);
            result = true;
          });
        return result;
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Lỗi đăng nhập', 'Email này đã được sử dụng');
        }
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Lỗi đăng nhập', 'Sai tài khoản hoặc mật khẩu');
        }
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Lỗi đăng nhập', 'Không tìm thấy tài khoản này');
        }
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Lỗi đăng nhập', 'Không tìm thấy tài khoản này');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Lỗi đăng nhập', 'Email không hợp lệ');
        }
        if (error.code === 'auth/too-many-requests') {
          Alert.alert(
            'Lỗi đăng nhập',
            'Chúng tôi đã chặn tất cả các yêu cầu từ thiết bị này do hoạt động bất thường. Thử lại sau.',
          );
        }

        console.log(error);
        return result;
      }
    },

    signOut: async () => {
      let uid;
      try {
        setUid(await AsyncStorage.getItem('userToken'));
        await auth()
          .signOut()
          .then(async () => {
            dispatch({type: 'LOGOUT'});
            database()
              .ref('/users/' + uid)
              .off();
            AsyncStorage.removeItem('userToken');
          });
      } catch (error) {}
    },

    signUp: async (email, password, name) => {
      let result = false;
      try {
        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then(user => {
            try {
              database()
                .ref('users/' + user.user.uid)
                .set({
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  email: email,
                  name: name,
                  avatar:
                    'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
                  isOnline: false,
                });
              Alert.alert('Thông báo', 'Đăng ký thành công');
              dispatch({
                type: 'LOGIN',
                token: user.user.uid,
              });
              AsyncStorage.setItem('userToken', user.user.uid);
              result = true;
              return result;
            } catch (error) {
              console.log(error);
            }
          });
      } catch (error) {
        console.log(error);
        return result;
      }
    },
  }));

  function onAuthStateChanged(newuser) {
    if (newuser != null) {
      let ref = '/users/' + newuser.uid;
      try {
        database()
          .ref(ref)
          .on('value', snapshot => {
            setUser(snapshot.val());
            console.log('Current user', snapshot.val().name);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    setTimeout(async () => {
      try {
        let userToken = null;
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        userToken = await AsyncStorage.getItem('userToken');
        setUid(userToken);

        dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
        console.log('UID:', uid);
        return subscriber;
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken != null ? <MyStack /> : <RootStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
