import React from "react";
import { StyleSheet } from "react-native";

import { DataTable, Avatar } from "react-native-paper";

const optionsPerPage = [2, 3, 4];

export default function CustomTable() {
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <DataTable>
      <DataTable.Row>
        {/* <DataTable.Cell>
          <Avatar.Image
            size={5}
            source={require("../assets/avatar.jpeg")}
            // style={{ marginRight: 10, marginLeft: 10 }}
          />
        </DataTable.Cell> */}

        <DataTable.Cell style={styles.cell}>Task A is Done</DataTable.Cell>
        <DataTable.Cell style={styles.cell}>2 hours ago</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell style={styles.cell}>Task B is Done</DataTable.Cell>
        <DataTable.Cell style={styles.cell}>3 hours ago</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell style={styles.cell}>Task C is Done</DataTable.Cell>
        <DataTable.Cell style={styles.cell}>3 hours ago</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell style={styles.cell}>Task D is Done</DataTable.Cell>
        <DataTable.Cell style={styles.cell}>3 hours ago</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Pagination
        page={page}
        numberOfPages={3}
        onPageChange={(page) => setPage(page)}
        label="1-2 of 6"
        optionsPerPage={optionsPerPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        showFastPagination
        optionsLabel={"Rows per page"}
      />
    </DataTable>
  );
}

const styles = StyleSheet.create({
  cell: {
    fontSize: 5,
  },
});
