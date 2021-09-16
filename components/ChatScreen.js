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
  const [isTyping, setIsTyping] = useState(false);
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
    let ava,
      sent = false,
      received = false,
      seen = false;
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
      sent,
      received,
      seen,
    };
    let count = 0;

    messages.forEach(e => {
      if (e._id == _id) {
        e = message;
        count++;
      }
    });

    // if (count == 0) {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    //}
    //  else {
    //   setMessages(previousMessages =>
    //     GiftedChat.setTed(previousMessages, message),
    //   );
    // }

    return message;
  };

  let listMess = [];

  const loadMess = useMemo(() => {
    if (currentFriend.messages != undefined) {
      listMess = currentFriend.messages;
    }
    if (currentFriend.isTyping != undefined) {
      setIsTyping(currentFriend.isTyping);
    }

    let keys = Object.keys(listMess).sort();
    keys.forEach(e => {
      parse(e, listMess[e]);
    });
  }, [user.listFriend[id].messages]);

  useEffect(() => {
    if (currentFriend.member != undefined) {
      setShowName(true);
    }
    return () => {
      let ref = '/users/' + id + '/listFriend/' + auth().currentUser.uid;
      database().ref(ref).update({isTyping: false});
    };
  }, []);

  const append = message => {
    let me = database().ref(ref).push(message);

    if (currentFriend.member == undefined) {
      let a = database()
        .ref(refup)
        .push(message, () => {
          me.update({
            received: true,
          }).then(console.log('Bạn bè nhận tin'));
        });
    } else {
      let member = Object.keys(currentFriend.member);
      member.forEach(e => {
        let refmem = '/users/' + e + '/listFriend/' + id + '/messages';
        database()
          .ref(refmem)
          .push(message, () => {
            me.update({
              received: true,
            }).then(console.log('Nhóm nhận tin'));
          });
      });
    }
  };

  const onSend = useCallback((messages = []) => {
    const {text, user} = messages[0];
    const mess = {text, user, createdAt: createdAt(), sent: true};
    append(mess);
  }, []);

  const onTextChanged = value => {
    let ref = '/users/' + id + '/listFriend/' + auth().currentUser.uid;
    if (value != '') {
      database().ref(ref).update({isTyping: true});
    } else {
      database().ref(ref).update({isTyping: false});
    }
  };

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <GiftedChat
        alwaysShowSend
        infiniteScroll
        onInputTextChanged={onTextChanged}
        isTyping={isTyping}
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
                onPress={() => alert('Chưa dùng được nha')}
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
