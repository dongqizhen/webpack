import React from "react";
import MyButton from "./MyButton.jsx";
import ListStore from "../stores/ListStore.jsx";
import ButtonActions from "../actions/ButtonActions.jsx";

class MyButtonController extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: ListStore.getAll() };
  }

  componentDidMount() {
    ListStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmoun() {
    ListStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState({
      items: ListStore.getAll()
    });
  }

  createNewItem(event) {
    ButtonActions.addNewItem("new item");
  }

  render() {
    return (
      <MyButton
        items={this.state.items}
        onClick={this.createNewItem.bind(this)}
      />
    );
  }
}

export default MyButtonController;
