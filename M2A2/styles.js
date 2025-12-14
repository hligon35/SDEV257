import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 40,
  },

  item: {
    margin: 5,
    padding: 5,
    color: "slategrey",
    backgroundColor: "ghostwhite",
    textAlign: "center",
  },

  tile: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  thumb: {
    width: 64,
    height: 64,
    marginRight: 12,
    backgroundColor: "black",
    borderRadius: 6,
  },

  itemText: {
    color: "black",
    fontSize: 18,
    flex: 1,
  },

  filter: {
    height: 40,
    width: 200,
  },

  controls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
});