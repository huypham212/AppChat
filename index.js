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

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
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
