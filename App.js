import React, {useState, useMemo, useEffect, useContext} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon, Avatar, ListItem} from 'react-native-elements';
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
import {SearchScr} from './components/SearchScreen';
function ListFriendsScreen({navigation}) {
  const {user} = useContext(AuthContext);
  //console.log(user.listFriend);

  user.listFriend.forEach(element => {
    if (element == null) {
      var i = user.listFriend.indexOf(element);
      user.listFriend.splice(i, 1);
    }
  });

  //console.log(user.listFriend);

  return (
    <View
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight - 20 || 0,
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View>
          {user.listFriend.map((l, i) => (
            <ListItem
              key={i}
              onPress={() => navigation.navigate('chat', {name: l.name})}
              onLongPress={() => {
                Alert.alert('Thông báo', l.id);
              }}>
              <Avatar rounded source={{uri: l.avatar}} size={50}>
                {l.state ? (
                  <Avatar.Accessory
                    name="circle"
                    size={20}
                    color="#00b300"
                    style={{backgroundColor: 'white'}}
                  />
                ) : null}
              </Avatar>
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </ScrollView>
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
          size={45}
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
        name="search"
        component={SearchScr}
        options={{headerShown: false}}
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
      try {
        await auth()
          .signOut()
          .then(async () => {
            dispatch({type: 'LOGOUT'});
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

  async function onAuthStateChanged(user) {
    if (user != null) {
      let ref = '/users/' + user.uid;
      try {
        await database()
          .ref(ref)
          .once('value', snapshot => {
            setUser(snapshot.val());
          });
      } catch (e) {
        console.log(e);
      }
    } else setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    setTimeout(async () => {
      try {
        let userToken = null;
        userToken = await AsyncStorage.getItem('userToken');
        dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return subscriber;
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
