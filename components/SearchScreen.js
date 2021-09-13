import {AuthContext} from './Context';
import React, {useState, useMemo, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, Alert, TextInput} from 'react-native';
import {
  Icon,
  Image,
  Switch,
  Avatar,
  ListItem,
  Input,
  SearchBar,
} from 'react-native-elements';

export function SearchScr({navigation}) {
  const [search, setSearch] = useState('');

  const updateSearch = search => {
    setSearch(search);
  };

  const textInputRef = React.useRef();

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current.focus(), 200);
    }
  }, []);

  return (
    <View style={{backgroundColor: 'white'}}>
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
      />
    </View>
  );
}
