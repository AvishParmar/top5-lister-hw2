import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items,
            editActive: -1
        }
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        
        if (this.props.currentList !== prevProps.currentList) {
            let items = null
            if(this.props.currentList !== null){
                items = this.props.currentList.items
            }
            
            this.setState({ items: items, editActive: prevProps.editActive });

        }
    }
    handleClick = (event, index) => {
        if (event.detail === 2) {
            this.handleToggleEdit(index);
            // console.log(item);
        }
    }
    handleToggleEdit = (index) => {
        console.log(index)
        this.setState({
            items: this.state.items,
            editActive: index
        });
    }
    handleUpdate = (event, index) => {
        let id = index;
        let textValue = this.state.text;
        console.log(textValue)
        if(textValue !== event.target.value){
            this.props.renameItemCallback(id, event.target.value);
            this.setState({
                text: event.target.value
            });
        }
        console.log("Item handleBlur: " + event.target.value);

        this.handleToggleEdit();
    }
    handleKeyPress = (event, index) => {
        if (event.code === "Enter") {
            this.handleUpdate(event, index);
        }
    }
    handleBlur = (event, index) => {
        this.handleUpdate(event, index)
        // let id = index;
        // let textValue = this.state.text;
        // console.log(textValue)
        // if(textValue === event.target.value){
        //     this.props.renameItemCallback(id, textValue);
        // }
        // console.log("Item handleBlur: " + textValue);
        // this.handleToggleEdit();
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
                                    onClick={event => this.handleClick(event, index)}
                                    onKeyPress={event => this.handleKeyPress(event, index)}>
                                    
                                    {(this.state.editActive === index)
                                        ? <input
                                            id={index}
                                            className='item-number'
                                            type='text'
                                            onKeyPress={event => this.handleKeyPress(event, index)}
                                            onBlur={event => this.handleBlur(event, index)}
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
