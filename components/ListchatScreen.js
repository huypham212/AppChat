import React, {useEffect, useMemo, useState} from 'react';
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
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Icon,
  Image,
  Input,
  ListItem,
  Button,
  Avatar,
  SearchBar,
} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './Context';

export function ListChatScr({navigation}) {
  const {user} = React.useContext(AuthContext);
  let keys = Object.keys(user.listFriend);

  const [l, setL] = useState([]);

  let listChat = [];

  const parseList = (key, value) => {
    if (value.messages != undefined) {
      let {avatar, name, isOnline, messages} = value;
      let _id = key;
      let a = Object.keys(messages).sort();
      let lastMess = a[a.length - 1];
      lastMess = messages[lastMess].text;
      const item = {
        _id,
        avatar,
        name,
        isOnline,
        lastMess,
        messages,
      };
      listChat.push(item);
      return item;
    }
  };
  const filterList = useMemo(() => {
    keys.forEach(e => {
      parseList(e, user.listFriend[e]);
    });
    let filter = listChat.filter(e => {
      if (e.messages != undefined) return e;
    });

    setL(filter);
  }, [user]);

  useEffect(() => {
    filterList;
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
          onPressIn={() => navigation.navigate('search')}
        />
        <View>
          {l.map((l, i) => (
            <ListItem
              key={i}
              onPress={() =>
                navigation.navigate('chat', {
                  name: l.name,
                  id: l._id,
                  ava: l.avatar,
                  isOnline: l.isOnline,
                })
              }
              onLongPress={() => {
                Alert.alert('Thông báo', 'jhjhj');
              }}>
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
                <ListItem.Subtitle>{l.lastMess}</ListItem.Subtitle>
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
});
