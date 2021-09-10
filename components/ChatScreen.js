import React, {useState, useCallback, useEffect} from 'react';
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

export function ChatScr() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <View style={{backgroundColor: '#1a1a1a', flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderSend={props => {
          return (
            <Send {...props}>
              <View style={{marginRight: 10, marginBottom: 10}}>
                <Icon name="send" type="font-awsome-5" />
              </View>
            </Send>
          );
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
                  backgroundColor: '#000000',
                },
                left: {
                  backgroundColor: '#333333',
                },
              }}
            />
          );
        }}
        renderActions={props => {
          return (
            <View style={{margin: 10}}>
              <Icon
                name="camera"
                type="font-awesome-5"
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
