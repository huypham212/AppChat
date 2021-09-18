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
import firestore from '@react-native-firebase/firestore';

export function SearchScr({navigation}) {
  const [search, setSearch] = useState('');
  const [infoFriend, setInfoFriend] = useState([]);
  const [infoNotFriend, setInfoNotFriend] = useState([]);
  const [lsNotFriend, setLsNotFriend] = useState([]);
  const [keyAllUser] = useState([]);
  const [keyFriend] = useState([]);
  const [keyNotFriend] = useState([]);
  const currentUser = auth().currentUser;
  //let keyAllUser = [];
  //let keyFriend = [];
  let listFriend = [];
  //let keyNotFriend = [];
  let listNotFriend = [];

  //using firestore to get all users
  // firestore()
  //   .collection('users')
  //   .where('info.name', '==', 'H')
  //   .get()
  //   .then(querySnapshot => {
  //     console.log('Total users: ', querySnapshot.size);

  //     querySnapshot.forEach(documentSnapshot => {
  //       console.log('User ID: ', documentSnapshot.id);
  //     });
  //   });

  const searchPress = () => {
    setSearch('');

    //lấy key của các user
    database()
      .ref('users/')
      .once('value', snapshot => {
        snapshot.forEach(element => {
          keyAllUser.push(element.key);
        });

        //lấy key trong listFriend
        database()
          .ref('users/' + currentUser.uid + '/listFriend')
          .once('value', snapshot => {
            snapshot.forEach(element => {
              keyAllUser.forEach(key => {
                if (key == element.key) {
                  keyFriend.push(element.key);
                }
              });
            });

            //push key của các user vào keyNotFriend
            keyAllUser.forEach(user => {
              keyNotFriend.push(user);
            });

            //pop các key trùng với key trong keyFriend
            keyFriend.forEach(friend => {
              keyNotFriend.forEach(not_friend => {
                if (not_friend == friend || not_friend == currentUser.uid) {
                  keyNotFriend.splice(keyNotFriend.indexOf(friend), 1);
                }
              });
            });

            //lấy info các user không phải là bạn
            keyNotFriend.forEach(element => {
              database()
                .ref('users/' + element)
                .once('value', snapshot => {
                  listNotFriend.push({
                    id: element,
                    name: snapshot.val().info.name,
                    avatar: snapshot.val().info.avatar,
                    isOnline: snapshot.val().info.isOnline,
                  });
                  setInfoNotFriend(listNotFriend);
                });
            });

            //lấy info theo key
            keyFriend.forEach(element => {
              database()
                .ref('users/' + element)
                .once('value', snapshot => {
                  listFriend.push({
                    id: element,
                    name: snapshot.val().info.name,
                    avatar: snapshot.val().info.avatar,
                    isOnline: snapshot.val().info.isOnline,
                  });
                  setInfoFriend(listFriend);
                });
            });
          });
      });
  };

  const updateSearch = search => {
    setSearch(search);

    if (search == '') {
      keyFriend.forEach(element => {
        database()
          .ref('users/' + element)
          .once('value', snapshot => {
            listFriend.push({
              id: element,
              name: snapshot.val().info.name,
              avatar: snapshot.val().info.avatar,
              isOnline: snapshot.val().info.isOnline,
            });
            setInfoFriend(listFriend);
          });
      });
    } else {
      //Tìm friend có tên trong seacrch bar
      keyFriend.forEach(element => {
        database()
          .ref('users/' + element)
          .on('value', snapshot => {
            if (snapshot.val().info.name.includes(search)) {
              listFriend.push({
                id: element,
                name: snapshot.val().info.name,
                avatar: snapshot.val().info.avatar,
                isOnline: snapshot.val().info.isOnline,
              });

              setInfoFriend(listFriend);
              //console.log(snapshot.val().info.name);
            }
            //console.log('List Friend: ' + listUser);
          });
      });

      //Tìm các user không phải bạn có tên trong search bar
      keyNotFriend.forEach(element => {
        database()
          .ref('users/' + element)
          .once('value', snapshot => {
            if (snapshot.val().info.name.includes(search)) {
              listNotFriend.push({
                id: element,
                name: snapshot.val().info.name,
                avatar: snapshot.val().info.avatar,
                isOnline: snapshot.val().info.isOnline,
              });
              setInfoNotFriend(listNotFriend);
            }
          });
      });
    }
  };

  const textInputRef = React.useRef();

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current.focus(), 200);
    }
  }, []);

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
          ref={textInputRef}
          onFocus={() => {
            searchPress();
          }}
        />
        {search == '' ? (
          <View style={{backgroundColor: 'white'}}>
            <Text>Bạn Bè</Text>
            {/* {console.log('info Friend:')} */}
            {/* {console.log(listFriend)} */}
            {/* {console.log(lsFriend)} */}
            {/* {console.log('Key User:')}
            {console.log(keyAllUser)}
            {console.log('Key Friend:')}
            {console.log(keyFriend)} */}
            {/* {console.log('Key Not Friend:')}
            {console.log(keyNotFriend)} */}
            <View>
              {infoFriend.map((l, i) => (
                <ListItem
                  key={i}
                  onPress={() =>
                    navigation.navigate('chat', {
                      name: l.name,
                      id: l._id,
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
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text>Bạn Bè</Text>
            <View>
              {infoFriend.map((l, i) => (
                <ListItem
                  key={i}
                  onPress={() =>
                    navigation.navigate('chat', {
                      name: l.name,
                      id: l._id,
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
              ))}
            </View>
            <Text>Những người khác</Text>
            <View>
              {infoNotFriend.map((l, i) => (
                <ListItem
                  key={i}
                  onPress={() => {
                    alert('Bạn đã kết bạn với ' + l.id);
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
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
