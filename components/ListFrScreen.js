import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import { View, ScrollView, Dimensions, Alert } from 'react-native';
import {Avatar, ListItem, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const window = Dimensions.get('window');

function ListForm({l, navigation}) {
  return (
    <View>
      {l.isOnline ? (
        <ListItem
          containerStyle={{height: 60}}
          onPress={() => {
            navigation.navigate('tabmain', {
              screen: 'listchat',
              params: {idFr: l._id},
            });
            navigation.navigate('chat', {
              name: l.name,
              id: l._id,
              ava: l.avatar,
              isOnline: l.isOnline,
            });
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
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ) : null}
    </View>
  );
}

const unFriend = id => {
  const currentUser = auth().currentUser;
  console.log(id, currentUser.uid);
  try {
    database()
      .ref('users/' + currentUser.uid + '/listFriend/' + id)
      .update({
        status: 'unfriend',
      });
  } catch (error) {
    console.log('Error from friend to currentUser');
    console.log(error);
  }

  try {
    database()
      .ref('users/' + id + '/listFriend/' + currentUser.uid)
      .update({
        status: 'unfriend',
      }).then;
  } catch (error) {
    console.log('Error from currentUser to friend');
    console.log(error);
  }
}

function ShowAll({l, navigation}) {
  return (
    <ListItem
      containerStyle={{height: 60}}
      onPress={() => {
        navigation.navigate('tabmain', {
          screen: 'listchat',
          params: {idFr: l._id},
        });
        navigation.navigate('chat', {
          name: l.name,
          id: l._id,
          ava: l.avatar,
          isOnline: l.isOnline,
        });
      }}
      onLongPress={() => {
        unFriend(l._id);
        Alert.alert("Thông báo", "Đã huỷ kết bạn thành công!")
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
      <ListItem.Content>
        <ListItem.Title>{l.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
}

export function ListFriendsScreen({navigation}) {
  const {user} = useContext(AuthContext);
  const [showAll, setShowAll] = useState(false);
  let friends;
  let list = [];
  let [count, setCount] = useState(0);

  let listFriend = [];
  const uid = auth().currentUser.uid;
  const currentUser = auth().currentUser;

  const [li, setL] = useState([]);

  let listChat = [];

  const parseList = (key, value) => {
    //console.log(value);
    let avatar, name, isOnline, messages, lastMess,status;
    avatar = value.avatar;
    name = value.name;
    status = value.status
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
      status
    };
    listChat.push(item);
    // console.log('Item:', item);
    return item;
  };

  const filterList = useMemo(() => {
    let a = 0;
    if (user.listFriend != undefined) {
      friends = user.listFriend;
      list = Object.values(friends);
      listFriend = Object.keys(friends).sort();
      list.forEach(e => {
        if (e.isOnline == true && e.status =='friend') {
          a++;
        }
      });
      setCount(a);
    }
    listFriend.forEach(e => {
      parseList(e, friends[e]);
    });
    setL(listChat);
  }, [user]);

  useEffect(() => {
    filterList;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Button
          title={'Đang hoạt động(' + count + ')'}
          type={showAll ? 'outline' : 'solid'}
          titleStyle={{color: showAll ? 'black' : 'white'}}
          buttonStyle={{
            backgroundColor: showAll ? 'white' : 'black',
            borderColor: 'black',
            borderWidth: 2,
            margin: 10,
            borderRadius: 20,
            width: window.width / 2 - 20,
          }}
          onPress={() => {
            setShowAll(false);
          }}
        />
        <Button
          title="Tất cả mọi người"
          type={showAll ? 'solid' : 'outline'}
          titleStyle={{color: showAll ? 'white' : 'black'}}
          buttonStyle={{
            backgroundColor: showAll ? 'black' : 'white',
            borderColor: 'black',
            borderWidth: 2,
            margin: 10,
            width: window.width / 2 - 20,
            borderRadius: 20,
          }}
          onPress={() => {
            setShowAll(true);
          }}
        />
      </View>
      <ScrollView>
        <View>
          {li.map((l, i) => (
            <View key={i}>
             {l.status == "friend" ?(
                <View>
                  {showAll ? (
                    <ShowAll l={l} navigation={navigation} />
                  ) : (
                    <ListForm l={l} navigation={navigation} />
                  )}
                </View>
              ):null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
