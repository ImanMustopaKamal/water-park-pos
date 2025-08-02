import { router } from "expo-router";
import { Button } from "react-native-paper";

export default function UserCreate() {
  return(
    <Button mode="contained" onPress={() => router.replace('/dashboard/user')}>
      Kembali
    </Button>
  )
}