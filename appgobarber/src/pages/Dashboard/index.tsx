import React, { FC } from 'react';
import { View } from 'react-native';

import { useAuth } from '../../hooks/auth';
import Button from '../../components/Button';

const Dashboard: FC = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Button onPress={signOut}>Sair</Button>
    </View>
  );
};

export default Dashboard;
