import React, {useState, useMemo, useEffect, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Image,
  Switch,
  Avatar,
  ListItem,
  Input,
  SearchBar,
  Button,
} from 'react-native-elements';
import {AuthContext} from './Context';
import PushNotification, {Importance} from 'react-native-push-notification';
import auth from '@react-native-firebase/auth';
export function Test() {
  // const {user} = useContext(AuthContext);
  // const create = () => {
  //   PushNotification.createChannel({
  //     channelId: 'message', // (required)
  //     channelName: 'Thông báo tin nhắn', // (required)
  //     channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
  //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true
  //     vibration: 2000,
  //     playSound: true, // (optional) default: true
  //     soundName: 'message_pop.mp3',
  //   });
  // };
  // const push = () => {
  //   PushNotification.localNotification({
  //     channelId: 'message', // (required)
  //     channelName: 'Thông báo tin nhắn',
  //     message: 'thông báo tin nhắn', // (required)
  //     actions: ['ReplyInput'],
  //     reply_placeholder_text: 'Nhập tin nhắn', // (required)
  //     reply_button_text: 'Trả lời', // (required)
  //     invokeApp: false,
  //     group: 'group',
  //     id: 1,
  //     vibrate: true,
  //     vibration: [
  //       180, 121, 134, 300, 289, 123, 134, 300, 621, 121, 134, 300, 289, 123,
  //       134, 300,
  //     ],
  //   });
  // };

  // useEffect(() => {
  //   create();
  // }, []);

  return (
    <View style={{flex: 1}}>
      {/* <Button title="Push" onPress={push} /> */}
    </View>
  );
}
