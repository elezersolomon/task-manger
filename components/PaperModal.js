import * as React from "react";
import { View } from "react-native";
import { Dialog, Portal, Provider, Button, Divider } from "react-native-paper";

const PaperModal = ({ visible, setVisible, title, children }) => {
  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title style={{ marginBottom: 10 }}>{title}</Dialog.Title>
            <Divider style={{ marginBottom: 10 }} />
            <Dialog.Content style={{ marginBottom: 10 }}>
              {children}
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default PaperModal;
