import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites videos screen</Text>
      <Link href="/" style={styles.button}>
        Go to Login screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#010101',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#010101',
  },
});

