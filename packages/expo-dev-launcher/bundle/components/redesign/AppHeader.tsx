import { useNavigation } from '@react-navigation/native';
import {
  useExpoTheme,
  Button,
  Image,
  Heading,
  Text,
  Divider,
  Row,
  Spacer,
  View,
  UserIcon,
} from 'expo-dev-client-components';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '../../hooks/useUser';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  appImageUri?: string;
};

export function AppHeader({ title, subtitle, appImageUri }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useExpoTheme();
  const { userData, selectedAccount } = useUser();

  const isAuthenticated = userData != null;
  const selectedUserImage = selectedAccount?.owner.profilePhoto;

  const onUserProfilePress = () => {
    navigation.navigate('User Profile');
  };

  return (
    <View>
      <Spacer.Horizontal style={{ height: insets.top }} />
      <Row px="medium" py="small" align="center">
        <Row>
          <View width="large" height="large" bg="secondary" rounded="medium">
            {Boolean(appImageUri) && (
              <Image size="large" rounded="medium" source={{ uri: appImageUri }} />
            )}
          </View>

          <Spacer.Horizontal size="small" />

          <View>
            <Heading size="small" weight="semibold">
              {title}
            </Heading>
            <Text size="small" color="secondary">
              {subtitle}
            </Text>
          </View>
        </Row>

        <Spacer.Horizontal size="flex" />

        <Button onPress={onUserProfilePress}>
          <View rounded="full">
            {isAuthenticated ? (
              <View bg="secondary">
                <Image size="large" rounded="full" source={{ uri: selectedUserImage }} />
              </View>
            ) : (
              <UserIcon color={theme.icon.default} />
            )}
          </View>
        </Button>
      </Row>

      <Divider weight="thin" />
    </View>
  );
}
