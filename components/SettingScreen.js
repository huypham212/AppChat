import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, Alert} from 'react-native';
import {Icon, Image, Switch, Avatar, ListItem} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
const currentUser = auth().currentUser;
export default function SettingsScreen() {
  const {signOut, user} = React.useContext(AuthContext);
  const listSettings = [
    {
      icon: 'sign-out-alt',
      title: 'Đăng xuất',
      action: () => {
        Alert.alert('Đăng xuất', 'Bạn đã đăng xuất');
        signOut();
      },
    },
    {
      icon: 'cog',
      title: 'Cài đặt',
      action: () => {
        alert('haha');
      },
    },
    {
      icon: 'home',
      title: 'Cài đặt',
      action: () => {
        alert('hihi');
      },
    },
  ];

  function Setting() {
    return (
      <View>
        <View style={{alignItems: 'center', margin: 20}}>
          <Avatar rounded source={{uri: currentUser.photoURL}} size={120}>
            <Avatar.Accessory
              size={30}
              color="gray"
              style={{backgroundColor: 'white'}}
              onPress={() => alert('hihi')}
            />
          </Avatar>
          <Text style={{fontSize: 25, marginTop: 10}}>
            {currentUser.displayName}
          </Text>
        </View>
        <View>
          {listSettings.map((l, i) => (
            <ListItem
              containerStyle={{marginHorizontal: 10}}
              key={i}
              bottomDivider
              onPress={l.action}>
              <Icon name={l.icon} type="font-awesome-5" />
              <ListItem.Content>
                <ListItem.Title>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {currentUser != null ? <Setting /> : null}
    </View>
  );
}
