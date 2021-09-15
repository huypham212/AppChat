import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {AuthContext} from './Context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export function ChatScr({navigation, route}) {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AuthContext);
  const [showName, setShowName] = useState(false);
  const id = route.params.id;

  const currentFriend = user.listFriend[id];

  const createdAt = () => {
    return database.ServerValue.TIMESTAMP;
  };

  let ref =
    '/users/' + auth().currentUser.uid + '/listFriend/' + id + '/messages';
  let refup =
    '/users/' + id + '/listFriend/' + auth().currentUser.uid + '/messages';

  const parse = (key, snapshot) => {
    let {createdAt: numberStamp, text, user} = snapshot;
    const createdAt = new Date(numberStamp);
    const _id = key;
    let ava;
    if (user.avatar != undefined) {
      ava = user.avatar;
    }

    user = {_id: user._id, name: user.name, avatar: ava};

    let image;
    if (snapshot.image != undefined) {
      image = snapshot.image;
    }

    const message = {
      _id,
      createdAt,
      text,
      user,
      image,
    };
    let count = 0;

    messages.find(e => {
      if (e._id == _id) {
        count++;
      }
    });

    if (count == 0) {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, message),
      );
    }
    return message;
  };

  let listMess = [];

  const loadMess = useMemo(() => {
    if (currentFriend.messages != undefined) {
      listMess = currentFriend.messages;
    }

    let keys = Object.keys(listMess).sort();
    keys.forEach(e => {
      parse(e, listMess[e]);
    });
  }, [user]);

  useEffect(() => {
    if (currentFriend.member != undefined) {
      setShowName(true);
    }
  }, []);

  const append = message => {
    database().ref(ref).push(message);
    if (currentFriend.member == undefined) {
      database().ref(refup).push(message);
    } else {
      let member = Object.keys(currentFriend.member);
      member.forEach(e => {
        let refmem = '/users/' + e + '/listFriend/' + id + '/messages';
        database().ref(refmem).push(message);
      });
    }
  };
  const onSend = useCallback((messages = []) => {
    const {text, user} = messages[0];
    const mess = {text, user, createdAt: createdAt()};
    append(mess);
  }, []);

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <GiftedChat
        renderUsernameOnMessage={showName}
        isLoadingEarlier={true}
        messages={messages}
        onSend={messages => onSend(messages)}
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
                onPress={() => alert('hihi')}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight + 150,
    backgroundColor: 'white',
  },
});
