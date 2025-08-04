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
import {
  deleteUser,
  getAllUsers,
} from "../../../database/services/userService";
import { useRole } from "../../../hooks/useRole";
import Container from "../../../components/Container";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { router } from "expo-router";

export default function User() {
  const { colors } = useCustomTheme();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { canEdit, canDelete } = useRole("user");
  const { showSnackbar } = useSnackbar();

  const columns = [
    { key: "name", title: "Nama" },
    { key: "username", title: "Username" },
    { key: "role_name", title: "Role" },
    { key: "", title: "Aksi" },
  ];

  const handleDelete = (item: any) => {
    Alert.alert(
      "Konfirmasi",
      "Yakin ingin menghapus data ini?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Batal"),
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              const response = await deleteUser(item.id);
              if (response) {
                showSnackbar("Data berhasil dihapus", "success");
                loadData();
              }
            } catch (error: any) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                  ? error
                  : "Terjadi kesalahan pada server";

              showSnackbar(errorMessage, "error");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers({ page, limit, search });
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
  }, [page, search]);

  return (
    <Container
      title="List User"
      addButton={{ path: "user", name: "User" }}
    >
      <Searchbar
        placeholder="Cari user"
        onChangeText={(query) => setSearch(query)}
        value={search}
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
          fontSize: 14,
          marginTop: -3,
        }}
      />
      <CustomDataTable
        columns={columns}
        data={data}
        page={page}
        totalItems={total}
        onPageChange={setPage}
        rowsPerPage={limit}
        onEdit={(item: any) => router.replace(`/user/${item.id}`)}
        onDelete={handleDelete}
        showEdit={canEdit}
        showDelete={canDelete}
      />
    </Container>
  );
}
