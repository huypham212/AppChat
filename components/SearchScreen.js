import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Icon,
  Image,
  Switch,
  Avatar,
  ListItem,
  Input,
  SearchBar,
  Button,
  ButtonGroup,
} from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export function SearchScr({navigation}) {
  const [search, setSearch] = useState('');
  const [listFriend, setListFriend] = useState([]);
  const [listSearch, setlistSearch] = useState([]);
  const [keyAllUser] = useState([]);
  const [keyFriend] = useState([]);
  const [keyNotFriend] = useState([]);
  const currentUser = auth().currentUser;

  const loadData = search => {
    keyAllUser.splice(0, keyAllUser.length);
    keyFriend.splice(0, keyFriend.length);
    keyNotFriend.splice(0, keyNotFriend.length);
    let list = [];
    let listFrd = [];
    database()
      .ref('users/')
      .once('value', snapshot => {
        snapshot.forEach(element => {
          if (
            element.key != currentUser.uid &&
            typeof element.val().info.name != 'undefined'
          ) {
            if (element.val().info.name.toLowerCase().includes(search)) {
              let status = '';
              database()
                .ref('users/' + currentUser.uid + '/listFriend')
                .once('value', snapshot => {
                  let check = -1;

                  snapshot.forEach(f => {
                    if (element.key == f.key) {
                      if (typeof f.val().status != undefined) {
                        status = f.val().status;
                        if (f.val().status == 'pending') {
                          check = 0;
                        } else {
                          check = 1;
                        }
                      }
                    }
                  });

                  let info = element.val().info;
                  info.id = element.key;
                  info.status = status;
                  list.push(info);
                  
                  //console.log(list);

                  switch (check) {
                    case -1:
                      console.log(element.val().info.name + ' không phải bạn');
                      break;
                    case 0:
                      console.log(element.val().info.name + ' đang chờ');
                      break;
                    case 1:
                      console.log(element.val().info.name + ' là bạn');
                      break;
                  }

                  setTimeout(() => {
                    setlistSearch(list);
                  }, 100);
                  
                });
            }
          }
        });
      });  
  };

  const updateSearch = search => {
    setSearch(search);
    setlistSearch([]);

    if (search != '') {
      loadData(search.toLowerCase());
    } else {
      setlistSearch([]);
    }
  };

  const addFriend = id => {
    //add friend vào currentUser
    try {
      database()
        .ref('users/' + id)
        .once('value', snapshot => {
          database()
            .ref('users/' + currentUser.uid + '/listFriend/' + id)
            .update({
              avatar: snapshot.val().info.avatar,
              name: snapshot.val().info.name,
              email: snapshot.val().info.email,
              isOnline: snapshot.val().info.isOnline,
              isTyping: false,
              seen: false,
              status: 'pending',
            });
        })
        .then(() => {
          loadData(search);
        });
    } catch (error) {
      console.log('Error from friend to currentUser');
      console.log(error);
    }

    //add currentUser vào friend
    try {
      database()
        .ref('users/' + currentUser.uid)
        .once('value', snapshot => {
          database()
            .ref('users/' + id + '/listFriend/' + currentUser.uid)
            .update({
              avatar: snapshot.val().info.avatar,
              name: snapshot.val().info.name,
              email: snapshot.val().info.email,
              isOnline: snapshot.val().info.isOnline,
              isTyping: false,
              seen: false,
              status: 'invited',
            });
        })
        .then(() => {
          loadData(search);
        });
    } catch (error) {
      console.log('Error from currentUser to friend');
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useMemo(() => {
    if (search == '' && listSearch.length > 0) {
      setlistSearch([]);
    }
  }, [listSearch]);

  const acceptInvite = id => {
    console.log(id);
    try {
      database()
        .ref('users/' + currentUser.uid + '/listFriend/' + id)
        .update({
          status: 'friend',
        })
        .then(() => {
          loadData();
        });
    } catch (error) {
      console.log('Error from friend to currentUser');
      console.log(error);
    }

    try {
      database()
        .ref('users/' + id + '/listFriend/' + currentUser.uid)
        .update({
          status: 'friend',
        })
        .then(() => {
          loadData();
        });
    } catch (error) {
      console.log('Error from currentUser to friend');
      console.log(error);
    }
  };
  const declineiInvite = id => {
    try {
      database()
        .ref('users/' + currentUser.uid + '/listFriend/' + id)
        .remove()
        .then(() => {
          loadData();
        });
    } catch (error) {
      console.log('Error from friend to currentUser');
      console.log(error);
    }

    try {
      database()
        .ref('users/' + id + '/listFriend/' + currentUser.uid)
        .remove()
        .then(() => {
          loadData();
        });
    } catch (error) {
      console.log('Error from currentUser to friend');
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <ScrollView>
        <SearchBar
          lightTheme
          round
          containerStyle={{backgroundColor: 'white', height: 55}}
          inputContainerStyle={{
            backgroundColor: '#e6e6e6',
            borderRadius: 50,
            height: 40,
          }}
          searchIcon={
            <Icon
              name="arrow-left"
              type="font-awesome-5"
              color="#a6a6a6"
              onPress={navigation.goBack}
            />
          }
          placeholder="Tìm kiếm bạn bè..."
          onChangeText={updateSearch}
          value={search}
        />
        {search == '' ? null : (
          <View>
            <Text 
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                paddingLeft: 15,
                paddingTop: 10
              }}>Những người khác</Text>
            <View>
              {listSearch.map((l, i) => (
                l.status != 'friend' ? (
                  <ListItem key={i}>
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
                  {l.status == 'invited' ? (
                    <View
                    style={{flex: 1, flexDirection: 'row', alignContent: 'flex-start'}}>
                    <Button
                      title="Chấp nhận"
                      buttonStyle={{
                        backgroundColor: '#306EFF',
                        fontWeight: 'bold',
                        borderRadius: 100,
                        marginLeft: 5,
                      }}
                      onPress={() => acceptInvite(l.id)}
                    />
                    <Button
                      onPress={() => declineiInvite(l.id)}
                      title="Từ chối"
                      titleStyle={{color: 'black'}}
                      buttonStyle={{
                        backgroundColor: '#CFCFCF',
                        borderRadius: 100,
                        marginLeft: 5,
                      }}
                    />
                  </View>
                    // <Button title="Chấp nhận" style={styles.addFrBtn} />
                  ) : (
                    <Button
                      title={l.status == 'pending' ? 'Đang chờ' : 'Kết bạn'}
                      style={styles.addFrBtn}
                      buttonStyle={{
                        borderRadius: 100,
                        backgroundColor: '#306EFF'
                      }}
                      onPress={() => {
                        if (l.status == '') {
                          addFriend(l.id);
                          Alert.alert('thông báo', 'đã gửi');
                        }
                      }}
                    />
                  )}
                </ListItem>
                
              ) : null))}
            </View>
            <Text 
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                paddingLeft: 15,
                paddingTop: 10
              }}>Bạn Bè</Text>
            <View>
              {listSearch.map((l, i) => (
                l.status == 'friend' ? (
                  <ListItem
                  key={i}
                  onPress={() =>
                    navigation.navigate('chat', {
                      name: l.name,
                      id: l.id,
                      ava: l.avatar,
                      isOnline: l.isOnline,
                    })
                  }>
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
                
                ) : null))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addFrBtn: {
    backgroundColor: '#306EFF',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
