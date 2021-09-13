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

export function ListFriendsScreen({navigation}) {
  const {user} = useContext(AuthContext);
  //console.log(user.listFriend);

  user.listFriend.forEach(element => {
    if (element == null) {
      var i = user.listFriend.indexOf(element);
      user.listFriend.splice(i, 1);
    }
  });

  //console.log(user.listFriend);

  return (
    <View
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight - 20 || 0,
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View>
          {user.listFriend.map((l, i) => (
            <ListItem
              key={i}
              onPress={() => navigation.navigate('chat', {name: l.name})}
              onLongPress={() => {
                Alert.alert('Thông báo', l.id);
              }}>
              <Avatar rounded source={{uri: l.avatar}} size={50}>
                {l.state ? (
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
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
