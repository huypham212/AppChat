import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, StatusBar, Modal, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Icon, Avatar, ListItem, Badge} from 'react-native-elements';
import {ListChatScr} from './ListchatScreen';
import {ChatScr} from './ChatScreen';
import {LoginScreen} from './LoginScreen';
import {SignUpScreen} from './SignUpScreen';
import {AuthContext} from './Context';
import SettingsScreen from './SettingScreen';
import {SearchScr} from './SearchScreen';
import {ListFriendsScreen} from './ListFrScreen';
import {ListFrInvite} from './ListFrInvite';
import {Test} from './test';

// header bên trái của tab navigation
function headerLeft({navigation}) {
  const {user} = useContext(AuthContext);
  return (
    <View>
      {user != null && user.info.avatar != null ? (
        <Avatar
          onPress={() => navigation.navigate('setting')}
          size={45}
          containerStyle={{marginLeft: 10}}
          rounded
          source={{
            uri: user.info.avatar,
          }}>
          {user.info.isOnline ? (
            <Avatar.Accessory
              name="circle"
              size={15}
              color="#00b300"
              style={{backgroundColor: 'white'}}
            />
          ) : null}
        </Avatar>
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
export function MyStack() {
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
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -20,
              }}>
                
              <Avatar
                size={40}
                containerStyle={{marginRight: 15}}
                rounded
                source={{
                  uri: route.params.ava,
                }}>
                {route.params.isOnline ? (
                  <Avatar.Accessory
                    name="circle"
                    size={15}
                    color="#00b300"
                    style={{backgroundColor: 'white'}}
                  />
                ) : null}
              </Avatar>
              <Text style={{fontSize: 20, color: 'white'}}>
                {route.params.name}
              </Text>
            </View>
          ),
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'black'},
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
      <Stack.Screen
        name="invite"
        component={ListFrInvite}
        options={{title: 'Lời mời kết bạn'}}
      />
      <Stack.Screen name="test" component={Test} options={{title: 'Tôi'}} />
    </Stack.Navigator>
  );
}

//Stack khi chưa đăng nhập
export function RootStack() {
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
        options={{headerShadowVisible: false, title: ''}}
      />
    </Stack.Navigator>
  );
}

//Tab navigation
const Tab = createBottomTabNavigator();
export function TabMain({navigation}) {
  const [count,setCount] = useState(0);
  const {user} = useContext(AuthContext);
  useEffect(() => {
    let c = 0
    setCount( 0)
    Object.values( user.listFriend).forEach(e =>{
      if( e.status == 'invited')
      {
         c +=1;
        setCount(c);
        console.log(count);
        
      }
    })
    
  }, [user.listFriend]);
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
                onPress={() => navigation.navigate('test')}
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
        name="Bạn bè"
        component={ListFriendsScreen}
        options={{
          headerLeft: props => headerLeft({navigation}),
          headerRight: props => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{zIndex: 1}}>
                <Icon
                  name="address-book"
                  type="font-awesome-5"
                  color="black"
                  raised
                  size={18}
                  solid={true}
                  onPress={() => navigation.navigate('invite')}
                />
              </View>
              <View
                style={{
                  top: 0,
                  right: 5,
                  zIndex: 2,
                  position: 'absolute',
                }}>
                <Badge
                  status="error"
                  value={count}
                  // containerStyle={{
                  //   top: 0,
                  //   right: 5,
                  //   zIndex: 1,
                  //   position: 'absolute',
                  // }}
                />
              </View>
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
              <Text style={{color: focused ? '#0066ff' : 'grey'}}>Bạn bè</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
