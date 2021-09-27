import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ListItem, Avatar, Button} from 'react-native-elements';

export function ListFrInvite({navigation}) {
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

  return (
    <View>
      {data.map((l, i) => (
        <ListItem key={i}>
          <Avatar rounded source={{uri: l.avatar}} size={40} />
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
          </ListItem.Content>
          <View
            style={{flex: 1, flexDirection: 'row', alignContent: 'flex-start'}}>
            <Button
              title="Chấp nhận"
              buttonStyle={{
                backgroundColor: '#306EFF',
                fontWeight: 'bold',
                borderRadius: 100,
                width: 80,
                marginLeft: 0,
              }}
            />
            <Button
              title="Từ chối"
              titleStyle={{color: 'black'}}
              buttonStyle={{
                backgroundColor: '#CFCFCF',
                fontWeight: 'bold',
                borderRadius: 100,
                width: 80,
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
