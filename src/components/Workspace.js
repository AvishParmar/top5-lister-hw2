import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items
        }
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.currentList !== prevProps.currentList) {
            this.setState({ items: this.props.currentList.items });

        }
    }
    render() {
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
                            this.state.items ? this.state.items.map((item) =>
                                <div className="item-number">{item}</div>) : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}