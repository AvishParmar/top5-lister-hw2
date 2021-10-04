import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        
        return (
            <div id="top5-banner">
                {this.props.title}
                <EditToolbar
                    jsTPS={this.props.jsTPS}
                    currentList={this.props.currentList} 
                    closeCallBack={this.props.closeCallBack} 
                    undoCallBack={this.props.undoCallBack}
                    redoCallBack={this.props.redoCallBack}
                />
            </div>
        );
    }
}