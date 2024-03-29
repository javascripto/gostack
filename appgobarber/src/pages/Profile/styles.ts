import { Platform } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'ios' ? 40 : 50}px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 50px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  /* margin-top: 32px; */
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 93px;
  margin-top: 64px;
  align-self: center;
`;
