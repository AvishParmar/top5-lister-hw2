import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items,
            editActive: false
        }
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.currentList !== prevProps.currentList) {
            this.setState({ items: this.props.currentList.items, editActive: prevProps.editActive });

        }
    }
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit();
            // console.log(item);
        }
    }
    handleToggleEdit = () => {
        this.setState({
            items: this.state.items,
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        this.setState({
            text: event.target.value
        });
    }
    handleKeyPress = (event, index) => {
        if (event.code === "Enter") {
            this.handleBlur(index);
        }
    }
    handleBlur = (index) => {
        let id = index;
        let textValue = this.state.text;
        // console.log("ListCard handleBlur: " + textValue);
        this.props.renameItemCallback(id, textValue);
        this.handleToggleEdit();
    }

    render() {
        // console.log(items)
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering" >
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                        {
                            this.state.items ? this.state.items.map((item, index) =>
                                <div
                                    id={index}
                                    className="item-number"
                                    onClick={event => this.handleClick(event, item, index)}
                                    onKeyPress={event => this.handleKeyPress(event, index)}>
                                    {this.state.editActive
                                        ? <input
                                            id={index}
                                            className='item-number'
                                            type='text'
                                            onKeyPress={event => this.handleKeyPress(event, index)}
                                            onBlur={() => this.handleBlur(item, index)}
                                            onChange={this.handleUpdate}
                                            defaultValue={item}
                                        />
                                        : item
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        )
    }

}
