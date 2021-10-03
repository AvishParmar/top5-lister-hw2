import React from "react";

export default class EditToolbar extends React.Component {
    constructor(props){
        super(props)
    }

    handleClose = (event) => {
        console.log(this.props)
        if(event.detail === 1)
            this.props.closeCallBack();
    }
    render() {
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className="top5-button">
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button">
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={this.handleClose}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}