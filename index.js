/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Test} from './components/test';
import PushNotification from 'react-native-push-notification';
// Must be outside of any component LifeCycle (such as `componentDidMount`).
import * as RootNavigation from './components/RootNavigation';
import {AuthContext} from './components/Context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {useContext} from 'react';
import * as Send from './components/ChatScreen';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // process the notification
    //console.log('đã xem thông báo');
    // (required) Called when a remote is received or opened, or local notification is opened
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
    RootNavigation.navigate('tabmain');
    RootNavigation.navigate('chat', {
      name: notification.title,
      id: notification.idFr,
      ava: notification.largeIconUrl,
    });
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
    if (notification.action === 'ReplyInput') {
      console.log('trả lời', notification.reply_text); // this will contain the inline reply text.
      let text = notification.reply_text;
      let id = notification.idFr;
      let currentFriend = notification.currentFriend;
      let me = notification.Me;
      user = {
        _id: auth().currentUser.uid,
        name: me.name,
        avatar: me.avatar,
      };
      const mess = {
        text,
        user,
        createdAt: database.ServerValue.TIMESTAMP,
        pending: true,
        seen: false,
        received: false,
      };
      let ref = '/users/' + auth().currentUser.uid + '/listFriend/' + id;
      if (currentFriend.member == undefined) {
        database().ref(ref).update({seen: false});
      }
      Send.append(id, currentFriend, mess);
    }
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});

AppRegistry.registerComponent(appName, () => App);
