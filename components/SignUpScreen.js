import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {AuthContext} from './Context';
import {Icon} from 'react-native-elements/dist/icons/Icon';

const window = Dimensions.get('window');
export function SignUpScreen() {
  const [showPass, setShowPass] = useState(true);
  const [showRePass, setShowRePass] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cfrPassword, setCfrPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const {signUp} = React.useContext(AuthContext);

  function SignUp(inputUserName, inputEmail, inputPassword) {
    if (inputEmail == '') {
      setErrorEmail('Email không được trống');
    } else {
      if (inputPassword <= 6) {
        alert('Password must have 6 characters!');
      } else {
        if (inputPassword != cfrPassword) {
          alert("Password dosen't matched!");
        } else {
          setIsloading(true);
          signUp(inputEmail, inputPassword, inputUserName).then(result => {
            if (result != true) {
              setIsloading(false);
            }
          });
        }
      }
    }
  }
  return (
    <SafeAreaView>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            left: window.width / 2 - 35,
            top: window.height / 4,
          }}>
          <ActivityIndicator size={60} color="#00ff00" />
        </View>
      ) : null}
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}>
        <View style={styles.container}>
          <Text style={styles.header}>Tạo tài khoản</Text>
          <Input
            placeholder="Họ và Tên"
            containerStyle={{marginTop: 50}}
            inputContainerStyle={styles.input}
            textContentType="nickname"
            numberOfLines={1}
            autoCorrect={false}
            onChangeText={setUserName}
            value={userName}
            leftIcon={{
              color: '#000000',
              type: 'font-awesome-5',
              name: 'user',
              style: {marginLeft: 15},
            }}
          />

          <Input
            placeholder="Email"
            inputContainerStyle={styles.input}
            textContentType="emailAddress"
            numberOfLines={1}
            autoCompleteType="email"
            autoCorrect={false}
            leftIcon={{
              type: 'font-awesome-5',
              name: 'envelope',
              style: {marginLeft: 15},
            }}
            onChangeText={setUserEmail}
            value={userEmail}
            errorMessage={errorEmail}
          />

          <Input
            placeholder="Mật khẩu"
            inputContainerStyle={styles.input}
            textContentType="password"
            secureTextEntry={showPass}
            numberOfLines={1}
            autoCorrect={false}
            placehoder="Password"
            leftIcon={{
              size: 40,
              type: 'evilicon',
              name: 'lock',
              style: {marginLeft: 5},
            }}
            rightIcon={
              <Icon
                name="eye"
                size={40}
                type="evilicon"
                onPress={() => setShowPass(!showPass)}
              />
            }
            onChangeText={setPassword}
            value={password}
          />

          <Input
            placeholder="Nhập lại mật khẩu"
            inputContainerStyle={styles.input}
            textContentType="password"
            secureTextEntry={showRePass}
            numberOfLines={1}
            placehoder="Confirm password"
            leftIcon={{
              size: 40,
              type: 'evilicon',
              name: 'lock',
              style: {marginLeft: 5},
            }}
            rightIcon={
              <Icon
                name="eye"
                size={40}
                type="evilicon"
                onPress={() => setShowRePass(!showRePass)}
              />
            }
            onChangeText={setCfrPassword}
            value={cfrPassword}
          />
        </View>
        <View>
          <Button
            title={'ĐĂNG KÝ'}
            buttonStyle={{
              backgroundColor: '#ff5050',
              borderRadius: 20,
              marginHorizontal: 20,
              height: 50,
            }}
            onPress={() => SignUp(userName, userEmail, password)}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 140,
  },
  content1: {
    fontSize: 20,
    color: 'black',
    paddingTop: 15,
  },
  content2: {
    fontSize: 15,
    color: 'black',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  input: {
    borderRadius: 28,
    backgroundColor: '#e6e6e6',
    borderBottomWidth: 0,
    height: 60,
    opacity: 0.6,
    marginHorizontal: 10,
  },
  // loginBtn: {
  //   margin: 25,
  // },
  signinBtn: {
    marginTop: 15,
  },
});
