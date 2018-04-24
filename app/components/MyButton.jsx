import React from "react";

class MyButton extends React.Component {
    constructor() {
        super();
        this.state = {
            someKey: "someValue"
        };
    }

    render() {
        let items = this.props.items,
            itemHtml = items.map((listItem, i) => <li key={i}>
                {listItem}
            </li>);

        return (
            <div>
                <ul>{itemHtml}</ul>
                <button onClick={this.props.onClick}>New Item</button>
            </div>
        );
    }

    componentDidMount() {
        this.setState({someKey: "otherValue"});
    }
}

export default MyButton;
