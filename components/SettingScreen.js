import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, Alert} from 'react-native';
import {Icon, Image, Switch, Avatar, ListItem} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const currentUser = auth().currentUser;

function Setting() {
  const {signOut, user} = React.useContext(AuthContext);
  const listSettings = [
    {
      icon: 'sign-out-alt',
      title: 'Đăng xuất',
      action: () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất', [
          {text: 'Hủy'},
          {text: 'OK', onPress: signOut},
        ]);
      },
    },
    {
      icon: 'cog',
      title: 'Cài đặt',
      action: () => {
        alert('haha');
      },
    },
    {
      icon: 'home',
      title: 'Cài đặt',
      action: () => {
        alert('hihi');
      },
    },
  ];

  const [image, setImage] = useState(null);

  const changeAvatar = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: true,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'image',
      includeBase64: true,
      cropping: true,
    }).then(images => {
      let name = images[0].path.substr(images[0].path.lastIndexOf('/'));
      const reference = storage().ref(
        auth().currentUser.uid + '/avatar/' + name,
      );

      const task = reference.putFile(images[0].path);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} của ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        reference.getDownloadURL().then(url => {
          let ref = '/users/' + auth().currentUser.uid + '/info/';
          database().ref(ref).update({avatar: url});
        });
      });
    });
  };

  return (
    <View>
      <View style={{alignItems: 'center', margin: 20}}>
        <Avatar rounded source={{uri: user.info.avatar}} size={120}>
          <Avatar.Accessory
            size={30}
            color="gray"
            style={{backgroundColor: 'white'}}
            onPress={changeAvatar}
          />
        </Avatar>
        <Text style={{fontSize: 25, marginTop: 10}}>{user.info.name}</Text>
      </View>
      <View>
        {listSettings.map((l, i) => (
          <ListItem key={i} bottomDivider onPress={l.action}>
            <Icon name={l.icon} type="font-awesome-5" />
            <ListItem.Content>
              <ListItem.Title>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const {user} = React.useContext(AuthContext);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {user != null ? <Setting /> : null}
    </View>
  );
}
