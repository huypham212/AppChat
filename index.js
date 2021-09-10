/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ChatScr} from './components/ChatScreen';
import {LoginScreen} from './components/LoginScreen';
import {SignUpScreen} from './components/SignUpScreen';

AppRegistry.registerComponent(appName, () => ChatScr);
