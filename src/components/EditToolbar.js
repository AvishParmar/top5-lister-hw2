import React from "react";

export default class EditToolbar extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            jsTPS: this.props.jsTPS,
            currentList: this.props.currentList
        }
    }

    handleClose = (event) => {
        if(event.detail === 1)
            this.props.closeCallBack();
    }

    handleUndo = (event) => {
        
        if(event.detail === 1)
            this.props.undoCallBack();
    }

    handleRedo = (event) => {
        if(event.detail === 1)
            this.props.redoCallBack();
    }
    render() {
        
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className="top5-button"
                    onClick={this.handleUndo}
                    style={this.state.jsTPS.hasTransactionToUndo() ? {} : {opacity: 0.5}}
                    >
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button"
                    onClick={this.handleRedo}
                    style={this.state.jsTPS.hasTransactionToRedo() ? {} : {opacity: 0.5}}
                    >
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={this.handleClose}
                    style={(this.state.currentList === null) ? {opacity: 0.5} : {}}
                    >
                        &#x24E7;
                </div>
            </div>
        )
    }
}