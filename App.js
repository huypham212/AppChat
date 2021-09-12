import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, Alert} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon, Avatar} from 'react-native-elements';
import {ListChatScr} from './components/ListchatScreen';
import {ChatScr} from './components/ChatScreen';
import {LoginScreen} from './components/LoginScreen';
import {SignUpScreen} from './components/SignUpScreen';
import {AuthContext} from './components/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import SettingsScreen from './components/SettingScreen';

function ListFriendsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>ListFr!</Text>
      <Icon
        raised
        name="users"
        type="font-awesome-5"
        color="#f50"
        onPress={() => alert('hello')}
      />
    </View>
  );
}

// header bên trái của tab navigation
function headerLeft({navigation}) {
  const {user} = useContext(AuthContext);
  return (
    <View>
      {user != null && user.avatar != undefined ? (
        <Avatar
          onPress={() => navigation.navigate('setting')}
          size={50}
          containerStyle={{marginLeft: 10}}
          rounded
          source={{
            uri: user.avatar,
          }}
        />
      ) : (
        <Avatar
          onPress={() => navigation.navigate('setting')}
          size={50}
          containerStyle={{marginLeft: 10}}
          rounded
          source={{
            uri: 'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
          }}
        />
      )}
    </View>
  );
}

// Stack khi đăng nhập thành côn
const Stack = createNativeStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="tabmain"
        component={TabMain}
      />
      <Stack.Screen
        name="chat"
        component={ChatScr}
        options={({route}) => ({
          title: route.params.name,
          headerTintColor: 'white',
          headerStyle: {backgroundColor: '#1a1a1a'},
        })}
      />
      <Stack.Screen
        name="setting"
        component={SettingsScreen}
        options={{title: 'Tôi'}}
      />
    </Stack.Navigator>
  );
}

//Stack khi chưa đăng nhập
function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{title: 'Đăng ký'}}
      />
    </Stack.Navigator>
  );
}

//Tab navigation
const Tab = createBottomTabNavigator();
function TabMain({navigation}) {
  return (
    <Tab.Navigator screenOptions={{tabBarShowLabel: false}}>
      <Tab.Screen
        name="listchat"
        component={ListChatScr}
        options={{
          title: 'Chat',
          headerLeft: props => headerLeft({navigation}),
          headerRight: props => (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Icon
                name="camera"
                type="font-awesome-5"
                color="black"
                raised
                size={18}
                solid={true}
              />
              <Icon
                name="pen"
                type="font-awesome-5"
                color="black"
                raised
                size={18}
                solid={true}
              />
            </View>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <View>
              <Icon
                size={20}
                name="comment"
                type="font-awesome-5"
                iconStyle={{color: focused ? '#0066ff' : 'grey'}}
                solid={true}
              />
              <Text style={{color: focused ? '#0066ff' : 'grey'}}>Chat</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Danh bạ"
        component={ListFriendsScreen}
        options={{
          headerLeft: props => headerLeft({navigation}),
          headerRight: props => (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Icon
                name="pen"
                type="font-awesome-5"
                color="black"
                raised
                size={18}
                solid={true}
              />
            </View>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <View>
              <Icon
                name="users"
                type="font-awesome-5"
                iconStyle={{color: focused ? '#0066ff' : 'grey'}}
                solid={true}
                size={20}
              />
              <Text style={{color: focused ? '#0066ff' : 'grey'}}>Danh bạ</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//Main
export default function App() {
  const [user, setUser] = useState(null);

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
      // case 'SIGNUP':
      //   return {
      //     ...prevState,
      //     userName: action.id,
      //     userToken: action.token,
      //     isLoading: false,
      //   };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState);

  function onAuthStateChanged(user) {
    console.log('update data user:', user);
    if (user != null) {
      let ref = '/users/' + user.uid;
      // console.log(ref);
      database()
        .ref(ref)
        .on('value', snapshot => {
          setUser(snapshot.val());
          // console.log('User data: ', snapshot.val());
        });
    } else setUser(user);
  }

  const authContext = useMemo(() => ({
    user,
    setUser,
    signIn: async (email, password) => {
      try {
        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(user => {
            dispatch({
              type: 'LOGIN',
              token: user.user.uid,
            });
            AsyncStorage.setItem('userToken', user.user.uid);
            return false;
          });
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
        if (error.code === 'auth/too-many-requests') {
          Alert.alert(
            'Lỗi đăng nhập',
            'Chúng tôi đã chặn tất cả các yêu cầu từ thiết bị này do hoạt động bất thường. Thử lại sau.',
          );
        }

        console.log(error);
        return true;
      }
    },

    signOut: async () => {
      try {
        await auth()
          .signOut()
          .then(() => {
            AsyncStorage.removeItem('userToken');
            dispatch({type: 'LOGOUT'});
          });
      } catch (error) {}
    },
    signUp: async (email, password, name) => {
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
              return false;
            } catch (error) {
              console.log(error);
            }
          });
      } catch (error) {
        console.log(error);
      }
      return true;
    },
  }));

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      const subscriber = await auth().onAuthStateChanged(onAuthStateChanged);
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (error) {
        console.log(error);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
      return subscriber;
    }, 200);
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
