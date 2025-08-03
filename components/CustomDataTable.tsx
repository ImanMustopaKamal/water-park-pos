import React from "react";
import { DataTable, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { TouchableOpacity, View } from "react-native";

interface Column {
  key: string;
  title: string;
  numeric?: boolean;
  render?: (value: any, row: RowData) => React.ReactNode;
}

interface RowData {
  [key: string]: string | number;
}

interface CustomDataTableProps {
  columns: Column[];
  data: RowData[];
  totalItems: number;
  rowsPerPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (item: RowData) => void;
  onDelete?: (item: RowData) => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  columns,
  data,
  rowsPerPage = 10,
  page = 0,
  totalItems = 0,
  onPageChange,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
}) => {
  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, data.length);
  const { colors } = useCustomTheme();

  return (
    <DataTable>
      <DataTable.Header>
        {columns.map((col) => (
          <DataTable.Title
            key={col.key}
            numeric={col.numeric}
            style={{ justifyContent: "center" }}
          >
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
              {col.title}
            </Text>
          </DataTable.Title>
        ))}
      </DataTable.Header>

      {data.slice(from, to).map((row, index) => (
        <DataTable.Row key={index}>
          {columns
            .filter((item: Column) => item.title !== "Aksi")
            .map((col) => (
              <DataTable.Cell
                key={col.key}
                numeric={col.numeric}
                style={{ justifyContent: "center" }}
              >
                {col.render ? (
                  col.render(row[col.key], row)
                ) : (
                  <Text style={{ textAlign: "center" }}>{row[col.key]}</Text>
                )}
                {/* <Text style={{ textAlign: "center" }}>{row[col.key]}</Text> */}
              </DataTable.Cell>
            ))}
          <DataTable.Cell style={{ justifyContent: "center" }}>
            {showEdit && (
              <TouchableOpacity
                onPress={() => onEdit?.(row)}
                style={{ padding: 8 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="pencil" size={20} style={{ color: colors.text }} />
              </TouchableOpacity>
            )}
            {showDelete && (
              <TouchableOpacity
                onPress={() => onDelete?.(row)}
                style={{ padding: 8 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="delete" size={20} style={{ color: colors.text }} />
              </TouchableOpacity>
            )}
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(totalItems / rowsPerPage)}
        onPageChange={onPageChange || (() => {})}
        label={`${from + 1}-${to} dari ${totalItems}`}
      />
    </DataTable>
  );
};

export default CustomDataTable;
