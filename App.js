import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon, Image} from 'react-native-elements';
import {ListChatScr} from './components/ListchatScreen';

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
      <Icon
        raised
        name="home"
        type="font-awesome-5"
        color="#f50"
        onPress={() => alert('hello')}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 60,
          },
        }}
        tabBarOptions={{
          showLabel: false,
          keyboardHidesTabBar: true,
        }}>
        <Tab.Screen
          name="Chat"
          component={ListChatScr}
          options={{
            headerLeft: props => (
              <Image
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
            ),
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
          component={SettingsScreen}
          options={{
            headerLeft: props => (
              <Image
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
            ),
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
                <Text style={{color: focused ? '#0066ff' : 'grey'}}>
                  Danh bạ
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
