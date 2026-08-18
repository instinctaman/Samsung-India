import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import {
  copyTableToClipboard,
  exportTableAsCsv,
  exportTableAsExcel,
  exportTableAsPdf,
  printTable,
} from "@/services/exportService";
import DataTableToolbar from "./DataTableToolbar";
import Pagination from "./Pagination";
import { DataTableColumn, DataTablePageSize, ExportAction } from "./types";

const DEFAULT_PAGE_SIZE_OPTIONS: DataTablePageSize[] = [10, 25, 50, 100, "all"];

function cellValue<T>(column: DataTableColumn<T>, row: T) {
  return column.searchValue ? column.searchValue(row) : column.exportValue ? column.exportValue(row, 0) : "";
}

type DataTableProps<T> = {
  title: string;
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  exportFileName?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: DataTablePageSize[];
  defaultPageSize?: DataTablePageSize;
  emptyLabel?: string;
};

export default function DataTable<T>({
  title,
  columns,
  data,
  keyExtractor,
  exportFileName = "export",
  searchPlaceholder = "Search...",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  defaultPageSize = 10,
  emptyLabel = "No data available.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<DataTablePageSize>(defaultPageSize);
  const [page, setPage] = useState(1);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [busyAction, setBusyAction] = useState<ExportAction | null>(null);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hiddenColumns.has(column.key)),
    [columns, hiddenColumns]
  );

  const searchedData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) => visibleColumns.some((column) => cellValue(column, row).toLowerCase().includes(query)));
  }, [data, search, visibleColumns]);

  const filteredData = useMemo(() => {
    if (!sort) return searchedData;
    const column = visibleColumns.find((c) => c.key === sort.key);
    if (!column) return searchedData;
    const withValue = searchedData.map((row) => ({ row, value: cellValue(column, row) }));
    withValue.sort((a, b) => {
      const numA = Number(a.value);
      const numB = Number(b.value);
      const comparison =
        a.value !== "" && b.value !== "" && !Number.isNaN(numA) && !Number.isNaN(numB)
          ? numA - numB
          : a.value.localeCompare(b.value);
      return sort.direction === "asc" ? comparison : -comparison;
    });
    return withValue.map((entry) => entry.row);
  }, [searchedData, sort, visibleColumns]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
    setPage(1);
  };

  const pageCount = pageSize === "all" ? 1 : Math.max(Math.ceil(filteredData.length / pageSize), 1);
  const currentPage = Math.min(page, pageCount);

  const pagedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageSize, currentPage]);

  const toExportRows = (rows: T[]) =>
    rows.map((row, index) => {
      const record: Record<string, unknown> = {};
      visibleColumns.forEach((column) => {
        record[column.key] = column.exportValue ? column.exportValue(row, index) : "";
      });
      return record;
    });

  const exportColumns = visibleColumns.map((column) => ({ key: column.key, header: column.header }));

  const runExport = async (action: ExportAction, task: () => Promise<void>) => {
    if (busyAction) return;
    setBusyAction(action);
    try {
      await task();
    } catch {
      // best-effort export - the share/print sheet is the user's retry surface
    } finally {
      setBusyAction(null);
    }
  };

  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.panelCard}>
        <View style={styles.toolbarWrap}>
          <DataTableToolbar
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            searchPlaceholder={searchPlaceholder}
            columns={columns.map((column) => ({ key: column.key, header: column.header }))}
            hiddenColumns={hiddenColumns}
            onToggleColumn={toggleColumn}
            onCopy={() => runExport("copy", () => copyTableToClipboard(exportColumns, toExportRows(filteredData)))}
            onExportCsv={() => runExport("csv", () => exportTableAsCsv(exportColumns, toExportRows(filteredData), exportFileName))}
            onExportExcel={() => runExport("excel", () => exportTableAsExcel(exportColumns, toExportRows(filteredData), exportFileName))}
            onExportPdf={() => runExport("pdf", () => exportTableAsPdf(title, exportColumns, toExportRows(filteredData), exportFileName))}
            onPrint={() => runExport("print", () => printTable(title, exportColumns, toExportRows(filteredData)))}
            busyAction={busyAction}
          />
        </View>

        <View style={styles.tableBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
              <View style={styles.headerRow}>
                {visibleColumns.map((column) => {
                  const isSortable = column.sortable !== false;
                  const isActive = sort?.key === column.key;
                  return (
                    <Pressable
                      key={column.key}
                      style={[styles.headerCell, { width: column.minWidth ?? 110 }]}
                      onPress={isSortable ? () => toggleSort(column.key) : undefined}
                      disabled={!isSortable}
                    >
                      <AppText
                        style={styles.headerCellText}
                        color={isActive ? Colors.mainColour1 : Colors.gray600}
                        weight={FontWeight.semiBold}
                        numberOfLines={1}
                      >
                        {column.header}
                      </AppText>
                      {isSortable && (
                        <Ionicons
                          name={isActive ? (sort!.direction === "asc" ? "chevron-up" : "chevron-down") : "swap-vertical"}
                          size={11}
                          color={isActive ? Colors.mainColour1 : Colors.gray400}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {pagedData.length === 0 ? (
                <View style={styles.emptyRow}>
                  <AppText style={styles.emptyText} color={Colors.gray600}>{emptyLabel}</AppText>
                </View>
              ) : (
                pagedData.map((row, localIndex) => {
                  const absoluteIndex = (pageSize === "all" ? 0 : (currentPage - 1) * pageSize) + localIndex;
                  return (
                    <View key={keyExtractor(row)} style={styles.bodyRow}>
                      {visibleColumns.map((column) => (
                        <View key={column.key} style={[styles.bodyCell, { width: column.minWidth ?? 110 }]}>
                          {column.render ? (
                            column.render(row, absoluteIndex)
                          ) : (
                            <AppText style={styles.bodyCellText} numberOfLines={1}>
                              {column.exportValue ? column.exportValue(row, absoluteIndex) : ""}
                            </AppText>
                          )}
                        </View>
                      ))}
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.paginationWrap}>
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            totalRows={filteredData.length}
            rangeStart={filteredData.length === 0 ? 0 : pageSize === "all" ? 1 : (currentPage - 1) * (pageSize as number) + 1}
            rangeEnd={pageSize === "all" ? filteredData.length : Math.min(currentPage * (pageSize as number), filteredData.length)}
            onPageChange={setPage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  panelCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    ...Shadows.card,
    overflow: "hidden",
  },
  toolbarWrap: { padding: 12, paddingBottom: 4 },
  tableBox: {
    marginHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  paginationWrap: {
    padding: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "rgba(198, 198, 198, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  headerCellText: { fontSize: Fonts.overline, letterSpacing: 0.3 },
  bodyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    alignItems: "center",
  },
  bodyCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  bodyCellText: { fontSize: Fonts.bodySm },
  emptyRow: { padding: 24, alignItems: "center" },
  emptyText: { fontSize: Fonts.bodySm },
});
