import React, {useState, useMemo, useEffect, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Avatar, Button} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export function ListFrInvite({navigation}) {
  const currentUser = auth().currentUser;
  const data = [
    {
      avatar:
        'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
      name: 'Gin Nguyễn',
    },
    {
      avatar:
        'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
      name: 'Christiano Ronaldo',
    },
    {
      avatar:
        'https://dongthanhphat.vn//userfiles/images/Partner/anh-dai-dien-FB-200.jpg',
      name: 'Phạm Nguyễn Thanh Huy',
    },
  ];

  const [list, setList] = useState([]);
  const loadData = () => {
    setList([]);
    database()
      .ref('users/' + currentUser.uid + '/listFriend')
      .once('value', snapshot => {
        snapshot.forEach(e => {
          if (e.val().status == 'invited') {
            let info = e.val();
            info.id = e.key;
            if (!list.includes(info)) {
              setList(old => old.concat(info));
            }
            console.log(list);
          }
        });
      });
  };
  useEffect(() => {
    loadData();
  }, []);
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
    <View>
      {list.map((l, i) => (
        <ListItem key={i}>
          <Avatar rounded source={{uri: l.avatar}} size={40} />
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
          </ListItem.Content>
          <View
            style={{flex: 1, flexDirection: 'row', alignContent: 'flex-start'}}>
            <Button
              icon={
                <Icon
                  name="check-circle"
                  size={30}
                  color="white"
                  type="font-awesome-5"
                />
              }
              buttonStyle={{
                backgroundColor: '#306EFF',
                fontWeight: 'bold',
                borderRadius: 100,
                marginLeft: 30,
              }}
              onPress={() => acceptInvite(l.id)}
            />
            <Button
              onPress={() => declineiInvite(l.id)}
              icon={
                <Icon
                  name="times-circle"
                  size={30}
                  color="white"
                  type="font-awesome-5"
                />
              }
              titleStyle={{color: 'black'}}
              buttonStyle={{
                backgroundColor: '#CFCFCF',
                borderRadius: 100,
                marginLeft: 5,
              }}
            />
          </View>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
