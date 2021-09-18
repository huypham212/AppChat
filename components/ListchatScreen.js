import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {Icon, ListItem, Button, Avatar, SearchBar} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {AuthContext} from './Context';
import PushNotification, {Importance} from 'react-native-push-notification';
import {useIsFocused} from '@react-navigation/native';
import Navigation from './Navigation';
export function ListChatScr({navigation, route}) {
  const {user} = React.useContext(AuthContext);
  const isFocused = useIsFocused(true);
  let friends;

  const [l, setL] = useState([]);
  const [idFr, setIdFr] = useState(null);

  let listChat = [];

  const create = () => {
    PushNotification.createChannel({
      channelId: 'message', // (required)
      channelName: 'Thông báo tin nhắn', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true
      vibration: 1000,
      playSound: true, // (optional) default: true
      soundName: 'message_pop.mp3',
    });
  };

  const NotifyPush = (id, text, name, avatar, idFr) => {
    PushNotification.localNotification({
      priority: 'high',
      vibration: 1000,
      channelId: 'message', // (required)
      channelName: 'Thông báo tin nhắn', // (required)
      title: name,
      message: text,
      largeIconUrl: avatar,
      id: id,
      actions: ['ReplyInput'],
      reply_placeholder_text: 'Nhập tin nhắn...', // (required)
      reply_button_text: 'Trả lời', //
      invokeApp: false,
      idFr,
      currentFriend: user.listFriend[idFr],
      Me: user.info,
    });
  };

  const parseList = (key, value) => {
    if (value.messages != undefined) {
      let {avatar, name, isOnline, messages} = value;
      let _id = key;
      let a = Object.keys(messages).sort();
      let lastMess = a[a.length - 1];
      let lastname = '';
      let lastTime = messages[lastMess].createdAt;
      let seen = false;
      let idFr = messages[lastMess].user._id;
      if (messages[lastMess].seen != undefined) {
        seen = messages[lastMess].seen;
      }
      if (messages[lastMess].user._id == auth().currentUser.uid) {
        lastMess = 'Bạn: ' + messages[lastMess].text;
      } else if (
        messages[lastMess].user.name != undefined &&
        value.member != undefined
      ) {
        lastname = messages[lastMess].user.name;
        lastname = lastname.substring(
          lastname.lastIndexOf(' '),
          lastname.length,
        );
        lastMess = lastname + ': ' + messages[lastMess].text;
      } else {
        lastMess = messages[lastMess].text;
      }
      if (lastMess.length > 20) {
        lastMess = lastMess.substr(0, 20) + '...';
      }

      const item = {
        _id,
        avatar,
        name,
        isOnline,
        lastMess,
        messages,
        lastTime,
        seen,
        idFr,
      };
      listChat.push(item);
      return item;
    }
  };
  let listFriend = [];
  const filterList = useMemo(() => {
    if (isFocused) {
      setIdFr(auth().currentUser.uid);
    }
    if (user.listFriend != undefined) {
      friends = user.listFriend;
      // keys = Object.keys(friends);
      listFriend = Object.keys(friends).sort();
      try {
        listFriend.forEach(e => {
          if (auth().currentUser.uid != null) {
            let ref = '/users/' + e.replace(' ', '') + '/info';
            let refup =
              '/users/' +
              auth().currentUser.uid +
              '/listFriend/' +
              e.replace(' ', '');
            const a = database()
              .ref(ref)
              .on('value', snapshot => {
                if (snapshot.val() != null) {
                  database().ref(refup).update(snapshot.val());
                }
              });

            // Thông báo tin nhắn nổi
            if (friends[e].messages != undefined) {
              let list = friends[e].messages;
              let length = Object.keys(list).length;
              let key = Object.keys(list).sort()[length - 1];
              let mess = list[key];
              let {_id, avatar, name} = mess.user;
              let id = _id.charCodeAt(0);
              if (
                mess.user._id != auth().currentUser.uid &&
                mess.user._id != idFr &&
                isFocused == false
              ) {
                if (mess.received != undefined) {
                  if (mess.received == false && mess.seen == false) {
                    NotifyPush(id, mess.text, name, avatar, _id);
                    let ref =
                      '/users/' +
                      auth().currentUser.uid +
                      '/listFriend/' +
                      e.replace(' ', '') +
                      '/messages/' +
                      key;
                    database().ref(ref).update({received: true});
                  }
                }
              } else {
                if (mess.received == false) {
                  let ref =
                    '/users/' +
                    auth().currentUser.uid +
                    '/listFriend/' +
                    e.replace(' ', '') +
                    '/messages/' +
                    key;
                  database().ref(ref).update({received: true});
                }
              }
            }
            return () => database().ref(ref).off('value', a);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    listFriend.forEach(e => {
      parseList(e, friends[e]);
    });
    let filter = listChat.filter(e => {
      if (e.messages != undefined) return e;
    });
    filter.sort((a, b) => b.lastTime - a.lastTime);
    setL(filter);
  }, [user]);

  useEffect(() => {
    filterList;
    create();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SearchBar
          lightTheme
          round
          containerStyle={{
            backgroundColor: 'white',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: '#e6e6e6',
            borderRadius: 50,
            height: 40,
          }}
          searchIcon={
            <Icon
              name="search"
              type="font-awesome-5"
              color="#bfbfbf"
              size={15}
            />
          }
          placeholder="Tìm kiếm"
          onPressIn={() => {
            navigation.navigate('search');
          }}
        />
        <View>
          {l.map((l, i) => (
            <ListItem
              key={i}
              onPress={() => {
                setIdFr(l._id);
                navigation.navigate('chat', {
                  name: l.name,
                  id: l._id,
                  ava: l.avatar,
                  isOnline: l.isOnline,
                });
              }}
              onLongPress={() => {
                Alert.alert('Thông báo', 'jhjhj');
              }}>
              <Avatar rounded source={{uri: l.avatar}} size={50}>
                {l.isOnline ? (
                  <Avatar.Accessory
                    name="circle"
                    size={15}
                    color="#00b300"
                    style={{backgroundColor: 'white'}}
                  />
                ) : null}
              </Avatar>
              <ListItem.Content h1>
                <Text
                  style={
                    l.seen || l.idFr == auth().currentUser.uid
                      ? styles.normal
                      : styles.bold
                  }>
                  {l.name}
                </Text>
                <Text
                  style={
                    l.seen || l.idFr == auth().currentUser.uid
                      ? styles.normalsub
                      : styles.bold
                  }>
                  {l.lastMess}
                </Text>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 80,
    marginVertical: 3,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
  },
  bold: {fontWeight: 'bold', fontSize: 16, color: 'black'},
  normal: {fontWeight: 'normal', color: 'black'},
  normalsub: {fontWeight: 'normal', color: 'grey'},
});
