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

export function SearchScr({navigation}) {
  const [search, setSearch] = useState('');
  const [lsFriend, setLsFriend] = useState([]);
  const currentUser = auth().currentUser;
  let keyUser = [];
  let listUser = [];
  let keyFriend = [];
  let listFriend = [];

  const searchPress = () => {
    setSearch('');

    //lấy key của các user
    database()
      .ref('users/')
      .once('value', snapshot => {
        snapshot.forEach(element => {
          keyUser.push(element.key);
        });
        console.log('Key User:');
        console.log(keyUser);

        //lấy key trong listFriend
        database()
          .ref('users/' + currentUser.uid + '/listFriend')
          .once('value', snapshot => {
            snapshot.forEach(element => {
              keyUser.forEach(key => {
                if (key == element.key) {
                  keyFriend.push(element.key);
                }
              });
            });
            console.log('Key listFriend:');
            console.log(keyFriend);

            //lấy info theo key
            keyFriend.forEach(element => {
              //console.log(element);
              database()
                .ref('users/' + element)
                .once('value', snapshot => {
                  listFriend.push({
                    id: element,
                    name: snapshot.val().info.name,
                    avatar: snapshot.val().info.avatar,
                    isOnline: snapshot.val().info.isOnline,
                  });

                  setLsFriend(listFriend);
                });
            });
          });
      });
  };

  const updateSearch = search => {
    setSearch(search);
    //console.log(search);

    // if (search == '') {
    //   //lấy key của friend
    //   database()
    //     .ref('users/' + currentUser.uid + '/listFriend')
    //     .once('value', snapshot => {
    //       snapshot.forEach(element => {
    //         keyFriend.push(element.key);
    //       });
    //       console.log('Friend: ' + keyFriend);
    //     });

    //   keyFriend.forEach(element => {
    //     database()
    //       .ref('users/' + element)
    //       .on('value', snapshot => {
    //         if (search == '') {
    //           listUser = [];
    //         } else {
    //           if (snapshot.val().info.name.includes(search)) {
    //             listUser.push({
    //               name: snapshot.val().info.name,
    //               avatar: snapshot.val().info.avatar,
    //             });
    //             //console.log(snapshot.val().info.name);
    //           }
    //           console.log('List Friend: ' + listUser);
    //         }
    //       });
    //   });
    // } else {
    //   //Lấy key của user
    //   database()
    //     .ref('users/')
    //     .once('value', snapshot => {
    //       snapshot.forEach(element => {
    //         if (search == '') {
    //           keyUser = [];
    //         } else {
    //           if (element.key != currentUser.uid) {
    //             keyUser.push(element.key);
    //             //console.log(element.key);
    //           }
    //         }
    //       });
    //       console.log('Others: ' + keyUser);
    //     });

    //   keyUser.forEach(element => {
    //     database()
    //       .ref('users/' + element)
    //       .on('value', snapshot => {
    //         if (search == '') {
    //           listUser = [];
    //         } else {
    //           if (snapshot.val().info.name.includes(search)) {
    //             listUser.push(snapshot.val().info.name);
    //             //console.log(snapshot.val().info.name);
    //           }
    //         }

    //         //console.log(listUser);
    //       });
    //   });
    // }
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
            {console.log('info Friend:')}
            {/* {console.log(listFriend)} */}
            {console.log(lsFriend)}
            <View>
              {lsFriend.map((l, i) => (
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
            <Text>Những người khác</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
