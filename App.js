import React, {useState, useMemo, useEffect} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';

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
  return (
    <Image
      onPress={() => {
        navigation.navigate('setting');
      }}
      source={{
        uri: 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/241369928_1860250734153812_7402333133344767277_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=7ZNf6mXAVAoAX_VJ7SJ&tn=L9zqKihI1L2YglTm&_nc_ht=scontent.fsgn2-3.fna&oh=be92db73e7fde3f00d379c1edf595945&oe=613FDA66',
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
    <Tab.Navigator>
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
  // const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null);

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
          // userName: null,
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
      case 'SIGNUP':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState);

  const authContext = useMemo(() => ({
    signIn: async userName => {
      let userToken = 'hihi';
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (error) {
        console.log(error);
      }
      dispatch({type: 'LOGIN', id: userName, token: userToken});
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (error) {
        console.log(error);
      }
      dispatch({type: 'LOGOUT'});
    },
    signUp: () => {},
  }));

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (error) {
        console.log(error);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
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
