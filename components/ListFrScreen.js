import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Icon,
  Image,
  Switch,
  Avatar,
  ListItem,
  Input,
  SearchBar,
} from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export function ListFriendsScreen({navigation}) {
  const {user} = useContext(AuthContext);

  let list = Object.values(user.listFriend);
  let count = 0;

  let listFriend = Object.keys(user.listFriend);
  const uid = auth().currentUser.uid;

  //let keys = Object.keys(user.listFriend);

  const [l, setL] = useState([]);

  let listChat = [];

  const parseList = (key, value) => {
    console.log(value);
    let avatar, name, isOnline, messages, lastMess;
    avatar = value.avatar;
    name = value.name;
    isOnline = value.isOnline;
    if (value.messages != undefined) {
      messages = value.messages;
      let a = Object.keys(messages).sort();
      lastMess = a[a.length - 1];
      lastMess = messages[lastMess].text;
    }
    messages = [];
    let _id = key;

    const item = {
      _id,
      avatar,
      name,
      isOnline,
      lastMess,
      messages,
    };
    listChat.push(item);
    console.log('Item:', item);
    return item;
  };

  list.forEach(e => {
    if (e.isOnline) {
      count++;
    }
  });

  const filterList = useMemo(() => {
    listFriend.forEach(e => {
      parseList(e, user.listFriend[e]);
    });
    setL(listChat);
    console.log(listChat);
  }, [user]);

  useEffect(() => {
    filterList;
    setTimeout(() => {
      try {
        listFriend.forEach(e => {
          if (uid != null) {
            let ref = '/users/' + e.replace(' ', '') + '/info';
            let refup = '/users/' + uid + '/listFriend/' + e.replace(' ', '');
            //console.log(ref, '\n', refup);
            const a = database()
              .ref(ref)
              .on('value', snapshot => {
                if (snapshot.val() != null) {
                  database()
                    .ref(refup)
                    .update(snapshot.val())
                    .then(() => {
                      console.log('update listfriends');
                    });
                }
              });
            return () => database().ref(ref).off('value', a);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View>
          <Text style={{marginLeft: 10}}>Đang hoạt động ({count})</Text>
          {l.map((l, i) => (
            <View key={i}>
              {l.isOnline ? (
                <ListItem
                  containerStyle={{height: 60}}
                  onPress={() =>
                    navigation.navigate('chat', {
                      name: l.name,
                      id: l._id,
                      ava: l.avatar,
                    })
                  }>
                  <Avatar rounded source={{uri: l.avatar}} size={50}>
                    {l.isOnline ? (
                      <Avatar.Accessory
                        name="circle"
                        size={20}
                        color="#00b300"
                        style={{backgroundColor: 'white'}}
                      />
                    ) : null}
                  </Avatar>
                  <ListItem.Content>
                    <ListItem.Title>{l.name}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
