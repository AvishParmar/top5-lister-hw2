import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        console.log(this.props)
        return (
            <div id="top5-banner">
                {this.props.title}
                <EditToolbar
                    closeCallBack={this.props.closeCallBack} 
                />
            </div>
        );
    }
}