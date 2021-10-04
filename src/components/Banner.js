import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        console.log("Inside Banner Render")

        return (
            <div id="top5-banner">
                {this.props.title}
                <EditToolbar
                    closeCallBack={this.props.closeCallBack} 
                    undoCallBack={this.props.undoCallBack}
                    redoCallBack={this.props.redoCallBack}
                />
            </div>
        );
    }
}