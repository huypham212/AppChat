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

export function ListFriendsScreen({navigation}) {
  const {user} = useContext(AuthContext);

  //console.log('chưa lọc', user.listFriend);
  const listFriend = user.listFriend.filter(e => {
    return e != null;
  });
  return (
    <View
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight - 20 || 0,
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View>
          <Text style={{marginLeft: 10}}>Đang hoạt động</Text>
          {listFriend.map((l, i) => (
            <View key={i}>
              {l.isOnline ? (
                <ListItem
                  containerStyle={{height: 60}}
                  onPress={() => navigation.navigate('chat', {name: l.name})}>
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
