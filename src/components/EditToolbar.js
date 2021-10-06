import React from "react";

export default class EditToolbar extends React.Component {
    constructor(props){
        super(props)
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
                    style={this.props.canUndo ? {} : {opacity: 0.5, cursor: "not-allowed"}}
                    >
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button"
                    onClick={this.handleRedo}
                    style={this.props.canRedo ? {} : {opacity: 0.5, cursor: "not-allowed"}}
                    >
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={this.handleClose}
                    style={(this.props.currentList === null) ? {opacity: 0.5, cursor: "not-allowed"} : {}}
                    >
                        &#x24E7;
                </div>
            </div>
        )
    }
}