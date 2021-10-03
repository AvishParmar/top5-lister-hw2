import React, { Component } from 'react';

export default class DeleteModal extends Component {
    // constructor(props){
    //     super(props)
        
    //     this.state = {
    //         currentlis
    //     }
    // }

    // // handleClick() = (event) => {

    // }
    render() {
        
        const { listKeyPair, hideDeleteListModalCallback} = this.props;
        let name = "";
        
        console.log(listKeyPair)
        if (listKeyPair) {
            name = listKeyPair.name 
        }
        
        return (
            <div
                className="modal"
                id="delete-modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <header className="dialog-header">
                        Delete the Top 5 {name} List?
                    </header>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                        >Confirm</button>
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={hideDeleteListModalCallback}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}