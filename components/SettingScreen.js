import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import {Icon, Switch, Avatar, ListItem, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import ImageModal from 'react-native-image-modal';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const currentUser = auth().currentUser;
const window = Dimensions.get('window');
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
  ];

  const [open, setOpen] = useState(false);
  const [change, setChange] = useState(false);
  const [image, setImage] = useState(null);

  function updateAva(images) {
    {
      const reference = storage().ref(
        auth().currentUser.uid + '/avatar/myavatar',
      );

      const task = reference.putFile(images.uri);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} của ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        reference.getDownloadURL().then(url => {
          let ref = '/users/' + auth().currentUser.uid + '/info/';
          database().ref(ref).update({avatar: url});
          setChange(false);
          setImage(null);
        });
      });
    }
  }

  const openGallery = () => {
    const options = {
      storageOtions: {
        path: 'images',
        mediaType: 'photo',
      },
      quality: 1,
      maxWidth: 400,
      maxHeight: 400,
      //includeBase64: true,
    };
    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('tắt camera');
      } else if (res.assets != undefined) {
        let image = {uri: res.assets[0].uri};
        setImage(image);
        setChange(true);
      } else console.log(res.errorCode);
    });
  };

  function ModalChangeAva() {
    return (
      <Modal animationType="fade" transparent={true} visible={change}>
        <View
          style={{
            flex: 1,

            backgroundColor: 'black',
          }}>
          <View style={{alignItems: 'flex-start'}}>
            <Icon
              name="close"
              color="white"
              style={{margin: 5}}
              size={30}
              onPress={() => setChange(false)}
            />
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              resizeMode="cover"
              source={image}
              style={{
                width: window.width,
                height: window.height - 150,
              }}></Image>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              buttonStyle={{margin: 10, width: 100, borderWidth: 2}}
              type="outline"
              title="Hủy"
              onPress={() => {
                setImage(null);
                setChange(false);
              }}
            />
            <Button
              buttonStyle={{margin: 10}}
              title="Lưu avatar"
              onPress={() => {
                updateAva(image);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
  
  return (
    <View>
      <View
        style={{
          alignItems: 'center',
          margin: 20,
        }}>
        <View>
          <ModalChangeAva />
          <ImageModal
            resizeMode="cover"
            modalImageResizeMode="contain"
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
            }}
            source={{uri: user.info.avatar}}
          />
          <Avatar.Accessory
            size={30}
            color="gray"
            style={{
              backgroundColor: 'white',
              marginRight: 10,
              marginBottom: 5,
            }}
            onPress={openGallery}
          />
        </View>

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
