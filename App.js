import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, Alert} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon, Image, Switch} from 'react-native-elements';
import {ListChatScr} from './components/ListchatScreen';
import {ChatScr} from './components/ChatScreen';
import {LoginScreen} from './components/LoginScreen';
import {SignUpScreen} from './components/SignUpScreen';
import {AuthContext} from './components/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

function SettingsScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
      <Switch />
      <Icon
        raised
        name="sign-out-alt"
        type="font-awesome-5"
        color="#f50"
        onPress={() => {
          Alert.alert('Đăng xuất', 'Bạn đã đăng xuất');
          signOut();
        }}
      />
    </View>
  );
}

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

function headerLeft({navigation}) {
  const {user} = useContext(AuthContext);
  return (
    <Image
      onPress={() => {
        navigation.navigate('setting');
      }}
      source={{
        uri: user != null ? user.avatar : null,
      }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 100,
        marginLeft: 10,
      }}
    />
  );
}

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

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

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
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'ISLOADING':
        return {
          ...prevState,
          userName: null,
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
    if (user != null) {
      let ref = '/user/' + user.uid;
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
      //dispatch({type: 'ISLOADING'});
      try {
        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(userCredential => {
            dispatch({
              type: 'LOGIN',
              id: email,
              token: userCredential.user.uid,
            });
            AsyncStorage.setItem('userToken', userCredential.user.uid);
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
        //dispatch({type: 'RETRIEVE_TOKEN', token: null});
        console.log(error);
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
    // signUp: () => {},
  }));

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
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
