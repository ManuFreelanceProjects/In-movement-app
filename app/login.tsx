import { View, Text, Button } from "react-native";

export default function LoginScreen({ navigation }: { navigation: any }) {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Go to Main Tabs" onPress={() => navigation.navigate('MainTabs')} />
    </View>
  );
}