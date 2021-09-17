import React, {useState, useMemo, useEffect, useContext} from 'react';
import {View, ActivityIndicator, Alert, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './components/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {MyStack, RootStack} from './components/Navigation';

//Main
export default function App() {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const currentUser = auth().currentUser;
  // Handle user state changes

  const initLoginState = {
    isLoading: true,
  };

  function loginReducer(prevState, action) {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isLoading: false,
        };
      case 'ISLOADING':
        return {
          ...prevState,
          isLoading: true,
        };
      case 'STOPLOADING':
        return {
          ...prevState,
          isLoading: false,
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState);

  const authContext = useMemo(() => ({
    user,
    signIn: async (email, password) => {
      let result = false;
      try {
        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(async user => {
            dispatch({
              type: 'LOGIN',
            });

            result = true;
          });
        return result;
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Lỗi đăng nhập', 'Email này đã được sử dụng');
        }
        if (error.code === 'auth/network-request-failed') {
          Alert.alert('Lỗi đăng nhập', 'Không thể kết nối Internet');
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
      let ref = '/users/' + currentUser.uid;

      try {
        setUser(null);
        database()
          .ref(ref + '/info')
          .update({isOnline: false})
          .then(() => console.log('update log out'));
        await auth()
          .signOut()
          .then(async () => {
            dispatch({type: 'LOGOUT'});
            database()
              .ref('/users/' + currentUser.uid)
              .off();
            await AsyncStorage.removeItem('currentUser');
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
                .ref('users/' + user.user.uid + '/info')
                .set({
                  email: email,
                  name: name,
                  avatar:
                    'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
                  isOnline: true,
                });
              Alert.alert('Thông báo', 'Đăng ký thành công');
              dispatch({
                type: 'LOGIN',
                token: user.user.uid,
              });
              //  AsyncStorage.setItem('userToken', user.user.uid);
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
          .on('value', async snapshot => {
            let a = snapshot.val();
            await AsyncStorage.removeItem('currentUser');
            await AsyncStorage.setItem('currentUser', JSON.stringify(a));
            setUser(a);
            if (snapshot.val().info.isOnline == false) {
              database()
                .ref(ref + '/info')
                .update({isOnline: true})
                .then(() => {});
            }
            database()
              .ref(ref + '/info/isOnline')
              .onDisconnect()
              .set(false);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    setTimeout(async () => {
      try {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        let c = await AsyncStorage.getItem('currentUser');
        if (c != null) {
          setUser(JSON.parse(c));
          console.log('current User:', JSON.parse(c).info.name);
        } else {
          setUser(null);
        }
        dispatch({type: 'RETRIEVE_TOKEN'});
        return () => {
          subscriber;
        };
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      let ref = '/users/' + auth().currentUser.uid;
      database().ref(ref).off();
      database()
        .ref(ref + '/info/')
        .update({isOnline: false});
    };
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size={60} color="#00ff00" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <NavigationContainer>
        {user != null ? <MyStack /> : <RootStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
