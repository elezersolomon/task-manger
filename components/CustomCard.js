import React from "react";
import { Card, Title, Paragraph, Surface, Avatar } from "react-native-paper";

export default function CustomCard({ title, description }) {
  return (
    <Card
      style={{
        width: "25%",
        height: "90%",
        marginRight: 20,
      }}
    >
      <Card.Content
        style={{
          backgroundColor: "gray",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Surface
          style={{
            backgroundColor: "green",
            height: "100%",
          }}
        >
          <Title style={{ marginTop: 1 }}>{title}</Title>
          <Paragraph style={{ fontSize: 13 }}> {description} </Paragraph>
        </Surface>

        <Surface style={{ backgroundColor: "red", paddingTop: "18%" }}>
          <Avatar.Icon size={24} icon="plus" />
        </Surface>
      </Card.Content>
    </Card>
  );
}
