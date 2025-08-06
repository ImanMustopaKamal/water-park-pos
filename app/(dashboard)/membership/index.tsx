import { Alert, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Searchbar,
  SegmentedButtons,
  Switch,
  Text,
} from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import { useEffect, useState } from "react";
import CustomDataTable from "../../../components/CustomDataTable";
import { useRole } from "../../../hooks/useRole";
import Container from "../../../components/Container";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { router } from "expo-router";
import {
  deleteMember,
  exportData,
  getAllMembers,
  importData,
} from "../../../database/services/membershipServices";
import { dateFormat } from "../../../utils/dateFormat";
import SwitchWithLabel from "../../../components/SwitchWithLabel";

const renderDate = () => (value: any) =>
  <Text style={{ textAlign: "center" }}>{dateFormat(value)}</Text>;

export default function Membership() {
  const { colors } = useCustomTheme();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { canEdit, canDelete } = useRole("user");
  const { showSnackbar } = useSnackbar();

  const columns = [
    { key: "category_name", title: "Nama Kategori" },
    { key: "code", title: "Kode Member" },
    { key: "name", title: "Nama" },
    { key: "phone", title: "No Tlp" },
    { key: "status_name", title: "Status" },
    { key: "start_at", title: "Tgl Mulai", render: renderDate() },
    { key: "end_at", title: "Tgl Akhir", render: renderDate() },
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
              const response = await deleteMember(item.id);
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
    // setLoading(true);
    try {
      const result = await getAllMembers({ page, limit, search, status });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      // console.error("DB Error:", err);
    } finally {
      // setLoading(false);
    }
  };

  const handleImport = async () => {
    console.log("okk");
    const data = await importData();
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await exportData({status, search});
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan pada server";

      showSnackbar(errorMessage, "error");
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, status]);

  return (
    <Container
      title="List Membership"
      validateButton={true}
      addButton={{ path: "membership", name: "Membership" }}
    >
      <View
        style={{
          justifyContent: "space-between",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {/* <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}> */}
        <Button
          icon={
            loading
              ? () => (
                  <ActivityIndicator color={colors.background} size="small" />
                )
              : "file-export"
          }
          mode="contained"
          disabled={loading}
          buttonColor={colors.secondary}
          labelStyle={{ fontWeight: "bold" }}
          onPress={handleExport}
          // style={{ alignSelf: "flex-start" }}
        >
          Export
        </Button>
        {/* <Button
            icon="file-import"
            mode="contained"
            buttonColor={colors.secondary}
            labelStyle={{ fontWeight: "bold" }}
            onPress={handleImport}
            style={{ alignSelf: "flex-start" }}
          >
            Import
          </Button> */}
        {/* </View> */}
        <SwitchWithLabel value={status} handleChange={setStatus} />
        <Searchbar
          placeholder="Cari member"
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
      </View>
      <CustomDataTable
        columns={columns}
        data={data}
        page={page}
        totalItems={total}
        onPageChange={setPage}
        rowsPerPage={limit}
        onEdit={(item: any) => router.replace(`/membership/${item.id}`)}
        onDelete={handleDelete}
        showEdit={canEdit}
        showDelete={canDelete}
      />
    </Container>
  );
}
