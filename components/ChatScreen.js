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
  const id = route.params.id;
  const ava = route.params.ava;

  const createdAt = () => {
    return database.ServerValue.TIMESTAMP;
  };
  let ref =
    '/users/' + auth().currentUser.uid + '/listFriend/' + id + '/messages';
  // const parse = snapshot => {
  //   let {createdAt: numberStamp, text, user} = snapshot.val();
  //   const {key: _id} = snapshot;
  //   user = {_id: user._id, name: user.name, avatar: ava};
  //   const createdAt = new Date(numberStamp);
  //   const message = {
  //     _id,
  //     createdAt,
  //     text,
  //     user,
  //   };
  //   let count = 0;

  //   messages.find(e => {
  //     if (e._id == _id) {
  //       count++;
  //     }
  //   });

  //   if (count == 0) {
  //     setMessages(previousMessages =>
  //       GiftedChat.append(previousMessages, message),
  //     );
  //   }
  //   return message;
  // };

  // useEffect(() => {
  //   setMessages([]);
  //   const b = database()
  //     .ref(ref)
  //     .on('child_added', snapshot => {
  //       if (snapshot != null) {
  //         parse(snapshot);
  //       }
  //     });
  //   return () => {
  //     database().ref(ref).off('child_added', b);
  //   };
  // }, []);

  const parse = (key, snapshot) => {
    let {createdAt: numberStamp, text, user} = snapshot;
    const _id = key;
    user = {_id: user._id, name: user.name, avatar: ava};
    const createdAt = new Date(numberStamp);
    const message = {
      _id,
      createdAt,
      text,
      user,
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

  let listMess = user.listFriend[id].messages;

  const loadMess = useMemo(() => {
    let keys = Object.keys(listMess).sort();
    keys.forEach(e => {
      parse(e, listMess[e]);
    });
    //console.log(messages);
  }, [user]);

  const append = message => {
    database().ref(ref).push(message);
  };
  const onSend = useCallback((messages = []) => {
    const {text, user} = messages[0];
    const mess = {text, user, createdAt: createdAt()};
    append(mess);
  }, []);

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <GiftedChat
        isLoadingEarlier={true}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth().currentUser.uid,
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
