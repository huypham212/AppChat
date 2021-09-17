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
import PushNotification from 'react-native-push-notification';
import auth from '@react-native-firebase/auth';
export function Test() {
  const {user} = useContext(AuthContext);
  const create = () => {
    PushNotification.createChannel({
      channelId: 'channel-id', // (required)
      channelName: 'My channel', // (required)
    });
  };

  useEffect(() => {
    create();
  }, []);
  const testPush = (id, text, name, avatar) => {
    console.log(id, text, name, avatar);
    PushNotification.localNotification({
      channelId: 'channel-id',
      title: name,
      message: text,
      largeIconUrl: avatar,
      id: id,
    });
  };
  const push = async () => {
    await PushNotification.localNotificationSchedule({
      channelId: 'channel-id',
      title: 'Hahaha',
      message: 'liu liu',
      date: new Date(Date.now() + 3000),
    });
  };
  let listFr = [];
  const Auto = useMemo(() => {
    if (user.listFriend != undefined) {
      listFr = user.listFriend;
      //listmessage = Object.values(listFr);
      let keys = Object.keys(user.listFriend);
      keys.forEach((e, i) => {
        if (listFr[e].messages != undefined) {
          let length = Object.values(listFr[e].messages).length;
          console.log(e, ':', length);
          let mess = Object.values(listFr[e].messages)[length - 1];
          let {_id, avatar, name} = Object.values(listFr[e].messages)[
            length - 1
          ].user;
          _id = parseInt(_id);
          if (mess != auth().currentUser.uid) {
            if (mess.received != undefined) {
              if (mess.received == false) {
                testPush(_id, mess.text, name, avatar);
                // console.log(_id, mess.text, name, avatar);
              }
            } else {
              testPush(_id, mess, name, avatar);
              //console.log(mess.text);
            }
          }
        }
      });
    }
  }, [user]);
  return (
    <View style={{flex: 1}}>
      <Button title="Push" onPress={push} />
    </View>
  );
}
