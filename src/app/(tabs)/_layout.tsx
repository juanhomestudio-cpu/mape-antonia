import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { Brand } from '@/constants/theme';
import { useSession } from '@/lib/auth-provider';
import { useProfile } from '@/hooks/use-profile';

const tabIcon = require('@/assets/images/tabIcons/home.png'); // TODO Fase F: iconos por tab

export default function TabsLayout() {
  const { session, loading: sessionLoading } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (sessionLoading || (session && profileLoading)) {
    return (
      <View style={{ flex: 1, backgroundColor: Brand.bone, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Brand.terracotta} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!profile?.onboarding_completed_at) {
    return <Redirect href="/intro" />;
  }

  return (
    <NativeTabs
      backgroundColor={Brand.bone}
      indicatorColor={Brand.surfaceMid}
      labelStyle={{ selected: { color: Brand.charcoal } }}>
      <NativeTabs.Trigger name="index">
        <Label>Inicio</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} androidSrc={tabIcon} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="path">
        <Label>Mi camino</Label>
        <Icon sf={{ default: 'map', selected: 'map.fill' }} androidSrc={tabIcon} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tools">
        <Label>Herramientas</Label>
        <Icon sf={{ default: 'book', selected: 'book.fill' }} androidSrc={tabIcon} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="me">
        <Label>Yo</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} androidSrc={tabIcon} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
