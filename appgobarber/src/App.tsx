import React from 'react';
import {View, Text} from 'react-native';

const App = () => {
  return (
    <View style={{alignSelf: 'center'}}>
      <Text
        style={{
          flex: 1,
          textAlignVertical: 'center',
          fontSize: 28,
        }}>
        Hello World
      </Text>
    </View>
  );
};

export default App;
