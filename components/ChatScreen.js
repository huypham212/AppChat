import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {AuthContext} from './Context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {CommonActions} from '@react-navigation/native';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import ImageModal from 'react-native-image-modal';

const window = Dimensions.get('window');

export function ChatScr({navigation, route}) {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AuthContext);
  const [showName, setShowName] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  let id = route.params.id;

  let currentFriend = user.listFriend[id];

  const parse = (key, snapshot, prever) => {
    let {createdAt: numberStamp, text, user} = snapshot;
    const createdAt = new Date(numberStamp);
    const _id = key;
    let ava,
      sent = false,
      received = false,
      seen = false,
      pending = false;

    if (user.avatar != undefined) {
      ava = user.avatar;
    }
    if (snapshot.sent != undefined) {
      sent = snapshot.sent;
    }
    if (snapshot.received != undefined) {
      received = snapshot.received;
    }
    if (snapshot.seen != undefined) {
      seen = snapshot.seen;
      if (seen) {
        received = true;
      }
    }
    if (snapshot.pending != undefined) {
      pending = snapshot.pending;
    }

    user = {_id: user._id, name: user.name, avatar: ava};

    let image;
    if (snapshot.image != undefined) {
      image = snapshot.image;
    }
    let avafr;
    if (currentFriend.avatar != undefined) {
      avafr = currentFriend.avatar;
    }
    let video;
    if (snapshot.video != undefined) {
      video = snapshot.video;
    }

    if (currentFriend.isOnline) {
      received = true;
      let r =
        '/users/' +
        auth().currentUser.uid +
        '/listFriend/' +
        id +
        '/messages/' +
        _id;
      database().ref(r).update({
        received: true,
      });
    }

    const message = {
      _id,
      createdAt,
      text,
      user,
      image,
      video,
      sent,
      received,
      seen,
      pending,
      avafr,
      myid: auth().currentUser.uid,
    };
    let count = 0;

    messages.forEach(e => {
      if (e._id == _id) {
        e = message;
        count++;
      }
    });

    if (prever) {
      //message.avafr = null;
      setMessages(previousMessages =>
        GiftedChat.prepend(previousMessages, message),
      );
    } else {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, message),
      );
    }
    return message;
  };

  let listMess = [];

  const [num, setNum] = useState(-20);
  const [fresh, setFresh] = useState(false);
  const [max, setMax] = useState(0);
  //load tin nhắn lần đầu + tn mới
  const loadMess = useMemo(() => {
    if (currentFriend.messages != undefined) {
      listMess = currentFriend.messages;
    }
    if (
      currentFriend.isTyping != undefined &&
      currentFriend.member == undefined
    ) {
      setIsTyping(currentFriend.isTyping);
    }

    let keys = Object.keys(listMess).sort();
    setMax(keys.length);
    keys = keys.slice(num);
    keys.forEach(async (e, i) => {
      parse(e, listMess[e], false);
      if (e.seen != true) {
        let ref =
          '/users/' +
          auth().currentUser.uid +
          '/listFriend/' +
          id +
          '/messages/' +
          e;

        let seen = currentFriend.seen;
        if (seen == true) {
          await database().ref(ref).update({seen: true});
        }
      }
    });
  }, [user]);

  //load tin nhắn cũ

  const [stop, setStop] = useState(false);
  useMemo(() => {
    if (num != -20) {
      if (currentFriend.messages != undefined) {
        listMess = currentFriend.messages;
      }
      let keys = Object.keys(listMess).sort();
      keys = keys.slice(num).reverse();
      keys.forEach(async (e, i) => {
        parse(e, listMess[e], true);
        if (e.seen == undefined || e.seen != true) {
          let ref =
            '/users/' +
            auth().currentUser.uid +
            '/listFriend/' +
            id +
            '/messages/' +
            e;

          let seen = currentFriend.seen;
          if (seen == true) {
            await database().ref(ref).update({seen: true});
          }
        }
      });
    }
  }, [num]);

  useMemo(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.setParams({isOnline: currentFriend.isOnline}),
      );
    }, 1000);
  }, [currentFriend.isOnline]);

  useEffect(() => {
    let ref = '/users/' + id + '/listFriend/' + auth().currentUser.uid;

    if (currentFriend.member != undefined) {
      setShowName(true);
    }
    //Cập nhập trạng thái đọc tin nhắn phía bạn bè
    if (currentFriend.member == undefined) {
      database()
        .ref(ref)
        .on('value', async snapshot => {
          if (snapshot.val().seen == false) {
            await database().ref(ref).update({seen: true});
          }
        });
    }
    return async () => {
      // setNum(-20);
      if (currentFriend.member == undefined) {
        database().ref(ref).off();
        await database().ref(ref).update({isTyping: false});
      }
    };
  }, []);
  const [images, setImage] = useState(null);
  const onSend = useCallback((messages, images = []) => {
    const {text, user} = messages[0];
    const mess = {
      text,
      user,
      image: undefined,
      createdAt: database.ServerValue.TIMESTAMP,
      pending: true,
      seen: false,
      received: false,
    };
    let ref = '/users/' + auth().currentUser.uid + '/listFriend/' + id;
    if (currentFriend.member == undefined) {
      database().ref(ref).update({seen: false});
    }

    append(id, currentFriend, mess, images);
  }, []);

  const append = (id, currentFriend, message, images) => {
    let ref =
      '/users/' + auth().currentUser.uid + '/listFriend/' + id + '/messages';
    let refup =
      '/users/' + id + '/listFriend/' + auth().currentUser.uid + '/messages';

    let me = database().ref(ref).push(message);

    if (currentFriend.member == undefined) {
      let a = database()
        .ref(refup)
        .push(message, () => {
          me.update({
            sent: true,
          });
          if (images != null) {
            let name = images[0].path.substr(images[0].path.lastIndexOf('/'));
            const reference = storage().ref(
              auth().currentUser.uid + '/listFriend/' + id + '/media/' + name,
            );

            const task = reference.putFile(images[0].path);
            task.on('state_changed', taskSnapshot => {
              console.log(
                `${taskSnapshot.bytesTransferred} của ${taskSnapshot.totalBytes}`,
              );
            });
            task.then(() => {
              console.log('Upload hình thành công');
              reference.getDownloadURL().then(url => {
                me.update({image: url});
                a.update({image: url});
                setImage(null);
              });
            });
          }
        });
    } else {
      let member = Object.keys(currentFriend.member);
      member.forEach(e => {
        let refmem = '/users/' + e + '/listFriend/' + id + '/messages';
        database()
          .ref(refmem)
          .push(message, () => {
            me.update({
              sent: true,
            }).then(console.log('Nhóm nhận tin'));
          });
      });
    }
  };

  const onTextChanged = async value => {
    let ref = '/users/' + id + '/listFriend/' + auth().currentUser.uid;
    if (currentFriend.member == undefined) {
      if (value != '') {
        await database().ref(ref).update({isTyping: true});
      } else {
        await database().ref(ref).update({isTyping: false});
      }
    }
  };

  // const openCamera = () => {
  //   const options = {
  //     storageOtions: {
  //       path: 'images',
  //       mediaType: 'photo',
  //     },
  //     includeBase64: true,
  //   };
  //   launchCamera(options, res => {
  //     if (res.didCancel) {
  //       console.log('tắt camera');
  //     } else if (res.assets != undefined) {
  //       let image = {uri: 'data:image/jpeg;base64,' + res.assets[0].base64};
  //       setImage(image);
  //     } else console.log(res.errorCode);
  //   });
  // };
  //Chọn ảnh từ thư viện
  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: true,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.7,
      mediaType: 'image',
      // includeBase64: true,
      cropping: true,
    })
      .then(images => {
        // console.log(images);
        setImage(images);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderMessageVideo = props => {
    return <View></View>;
  };
  const renderMessageImage = props => {
    return (
      <View
        style={{
          borderRadius: 15,
          padding: 2,
        }}>
        <ImageModal
          resizeMode="cover"
          modalImageResizeMode="contain"
          style={{
            width: 150,
            height: 100,
            borderRadius: 10,
          }}
          source={{uri: props.currentMessage.image}}
        />
      </View>
    );
  };

  if (user != null) {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <GiftedChat
          infiniteScroll
          renderMessageImage={renderMessageImage}
          renderLoading={() => (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          loadEarlier={fresh}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: () => {
              setFresh(true);
              if (fresh && stop == false) {
                setNum(num - 10);
                setFresh(false);
              }
              if (num < max * -1) {
                setStop(true);
                setFresh(false);
              }
            },
          }}
          infiniteScroll
          onInputTextChanged={onTextChanged}
          isTyping={isTyping}
          renderUsernameOnMessage={showName}
          isLoadingEarlier={true}
          messages={messages}
          onSend={messages => onSend(messages, images)}
          user={{
            _id: auth().currentUser.uid,
            name: user.info.name,
            avatar: user.info.avatar,
          }}
          renderSend={props => {
            return (
              <Send {...props}>
                <View style={{marginRight: 10, marginBottom: 10}}>
                  <Icon name="send" type="font-awsome-5" color="white" />
                </View>
              </Send>
            );
          }}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: 'black',
                  borderTopWidth: 0,
                }}
              />
            );
          }}
          placeholder="Nhập tin nhắn..."
          textInputStyle={{
            color: 'white',
            marginRight: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#333333',
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  left: {
                    color: 'white',
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#333333',
                  },
                  left: {
                    backgroundColor: '#595959',
                  },
                }}
              />
            );
          }}
          dateFormat="DD/MM/YYYY"
          timeFormat="HH:mm"
          renderActions={props => {
            return (
              <View style={{margin: 10}}>
                <Icon
                  name="camera"
                  type="font-awesome-5"
                  color="white"
                  onPress={openGallery}
                />
              </View>
            );
          }}
        />
        {images != null ? (
          <ScrollView style={{height: 200}}>
            <View style={styles.container}>
              {images.map((e, i) => (
                <Avatar
                  containerStyle={styles.imgwrap}
                  key={i}
                  size={150}
                  source={{uri: e.path}}
                />
              ))}
            </View>
          </ScrollView>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent: 'center',
  },
  imgwrap: {
    margin: 3,
    height: window.width / 3 - 6,
    width: window.width / 3 - 6,
  },
});
