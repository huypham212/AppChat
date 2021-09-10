import * as React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
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
} from 'react-native-elements';

const list = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Uyên Khùng',
    content: 'Chán quá',
    ava: 'https://scontent.xx.fbcdn.net/v/t1.6435-1/p100x100/90084631_2545692372385647_1868446112474464256_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=dbb9e7&_nc_ohc=WXJF2Gwb_SMAX-9tNIt&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=1c07add1bf87996c200cea1989d5fdf4&oe=615FF5CC',
    state: true,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Trà sữa Homita',
    content: 'hihi',
    ava: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/p100x100/176486153_463050571650249_170897513256995068_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=58c789&_nc_ohc=hO7njK5t0GAAX_3poS5&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=c401e694f268bb1536808af18849ab9e&oe=615FAF16',
    state: true,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Lưu Hoàng Long',
    content: 'huhu',
    ava: 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/241369928_1860250734153812_7402333133344767277_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=7ZNf6mXAVAoAX_VJ7SJ&tn=L9zqKihI1L2YglTm&_nc_ht=scontent.fsgn2-3.fna&oh=be92db73e7fde3f00d379c1edf595945&oe=613FDA66',
    state: false,
  },
];

export function ListChatScr() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Input
          placeholder="Tìm kiếm"
          leftIcon={{
            type: 'font-awesome-5',
            name: 'search',
            color: 'grey',
            style: {marginLeft: 10},
            size: 18,
          }}
          inputContainerStyle={{
            borderRadius: 50,
            backgroundColor: '#e6e6e6',
            borderBottomWidth: 0,
          }}
          containerStyle={{marginTop: 5}}
        />
        <View>
          {list.map((l, i) => (
            <ListItem.Swipeable
              key={i}
              onPress={() => {
                alert(l.id);
              }}
              leftContent={
                <Button
                  title="Info"
                  icon={{name: 'info', color: 'white'}}
                  buttonStyle={{minHeight: '100%'}}
                />
              }
              rightContent={
                <Button
                  title="Xóa"
                  icon={{name: 'delete', color: 'white'}}
                  buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                />
              }>
              <Avatar rounded source={{uri: l.ava}} size={50}>
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
                <ListItem.Subtitle>{l.content}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Swipeable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight - 20 || 0,
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
