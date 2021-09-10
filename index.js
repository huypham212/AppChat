/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {LoginScreen} from './components/LoginScreen';
import {SignUpScreen} from './components/SignUpScreen';

AppRegistry.registerComponent(appName, () => App);
