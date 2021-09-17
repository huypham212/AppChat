/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Test} from './components/test';
import PushNotification from 'react-native-push-notification';
// Must be outside of any component LifeCycle (such as `componentDidMount`).
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
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
    if (notification.action === 'ReplyInput') {
      console.log('trả lời', notification.reply_text); // this will contain the inline reply text.
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

  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
