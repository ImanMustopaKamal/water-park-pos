import { Alert, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import { useEffect, useState } from "react";
import CustomDataTable from "../../../components/CustomDataTable";
import { getAllUsers } from "../../../database/services/userService";
import { useRole } from "../../../hooks/useRole";
import { router } from "expo-router";
import Container from "../../../components/Container";

export default function User() {
  const { colors } = useCustomTheme();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const { canEdit, canDelete } = useRole("user");

  const columns = [
    { key: "name", title: "Nama" },
    { key: "username", title: "Username" },
    { key: "role_name", title: "Role" },
    { key: "", title: "Aksi" },
  ];

  const handleEdit = (item: any) => {
    Alert.alert("Edit", `Edit data: ${item.id}`);
  };

  const handleDelete = (item: any) => {
    Alert.alert("Hapus", `Hapus data: ${item.id}`);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers({ page, limit });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("DB Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <Container
      title="List User"
      addButton={{ path: "user", name: "Tambah User" }}
    >
      <Searchbar
        placeholder="Cari nama atau username"
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        style={{
          marginBottom: 16,
          backgroundColor: colors.border,
          width: "30%",
          height: 50,
          fontSize: 14,
          borderRadius: 25,
          alignSelf: "flex-end",
        }}
        inputStyle={{
          fontSize: 14, // ukuran teks di dalam search bar
          marginTop: -3, // agar teks lebih sejajar
        }}
      />
      <CustomDataTable
        columns={columns}
        data={data}
        page={page}
        totalItems={total}
        onPageChange={setPage}
        rowsPerPage={limit}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showEdit={canEdit}
        showDelete={canDelete}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 2,
    borderRadius: 15,
  },
  content: {
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
  },
});
