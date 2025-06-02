import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
inmport 

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Ouvre le fichier App.js pour commencer à travailler sur ton application !</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
