import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'
import jsTPS from './common/jsTPS';
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction'
import MoveItem_Transaction from './transactions/MoveItem_Transaction'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();
        
        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList: null,
            sessionData: loadedSessionData,
            canUndo: false,
            canRedo: false
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKey);
        window.focus();
    }
    
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKey);
    }
    
    handleKey = (event) => {
        if(event.ctrlKey){
            if(event.keyCode === 90){
                this.undoList();
            }
            else if(event.keyCode === 89){
                this.redoList();
            }
        }
    }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        if(this.state.currentList === null){
            let newKey = this.state.sessionData.nextKey;
            let newName = "Untitled" + newKey;
    
            // MAKE THE NEW LIST
            let newList = {
                key: newKey,
                name: newName,
                items: ["?", "?", "?", "?", "?"]
            };
    
            // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
            // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
            let newKeyNamePair = { "key": newKey, "name": newName };
            let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
            this.sortKeyNamePairsByName(updatedPairs);
    
            // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
            // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
            // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
            // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
            // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
            // SHOULD BE DONE VIA ITS CALLBACK
            this.setState(prevState => ({
                currentList: newList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey + 1,
                    counter: prevState.sessionData.counter + 1,
                    keyNamePairs: updatedPairs
                },
                canUndo: this.tps.hasTransactionToUndo(),
                canRedo: this.tps.hasTransactionToRedo()
    
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.tps.clearAllTransactions();
                this.db.mutationCreateList(newList);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        }
       
    }

    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            if(currentList.name != newName){
                currentList.name = newName;
                this.tps.clearAllTransactions();
            }  
        }
        
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            },
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    // refreshList = (keyNamePair) => {
    //     let items = keyNamePair.items
    //     for(i = 0; i < 6; i++){
    //         items[i].id = i
    //     }
    // }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let current = this.state.currentList
        let newCurrentList = this.db.queryGetList(key);
        console.log(newCurrentList)
        console.log(current)
        if(current !== null){
            if(current.key !== newCurrentList.key){
                console.log("Transactions cleared")
                this.tps.clearAllTransactions();
            }
        }
        
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData,
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData,
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }), () => {
            // ANY AFTER EFFECTS?
            // let list = this.db.queryGetList(currentList.key);
            
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    undoList = () => {
        if(this.tps.hasTransactionToUndo()){
            let itemKeyPair = this.tps.undoTransaction()
            let current = this.state.currentList
            current.items[itemKeyPair.key] = itemKeyPair.name
    
            this.setState(prevState => ({
                currentList: current,
                listKeyPairMarkedForDelete: prevState.listKeyPairMarkedForDeletion,
                sessionData: prevState.sessionData,
                canUndo: this.tps.hasTransactionToUndo(),
                canRedo: this.tps.hasTransactionToRedo()
            }), () => {
                
                //console.log(transaction) 
                // this.tps.addTransaction(transaction)
                
                this.db.mutationUpdateList(current);
                this.db.mutationUpdateSessionData(this.state.sessionData)
    
            });
        }
        
    }

    redoList = () => {
        if(this.tps.hasTransactionToRedo()){
            let itemKeyPair = this.tps.doTransaction()
            let current = this.state.currentList
            current.items[itemKeyPair.key] = itemKeyPair.name
            // console.log(itemKeyPair.name)
            // console.log(current.item[itemKeyPair.key])
            // current.item[itemKeyPair.key] = itemKeyPair.name
    
            this.setState(prevState => ({
                currentList: current,
                listKeyPairMarkedForDelete: prevState.listKeyPairMarkedForDeletion,
                sessionData: prevState.sessionData,
                canUndo: this.tps.hasTransactionToUndo(),
                canRedo: this.tps.hasTransactionToRedo()
            }), () => {
                
                this.db.mutationUpdateList(current);
                this.db.mutationUpdateSessionData(this.state.sessionData)
            });
        }
        
    }

    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: keyNamePair,
            sessionData: prevState.sessionData,
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }), () =>{
            
            this.showDeleteListModal();
        })
    }

    changeItem(id, text) {
        this.state.currentList.items[id] = text;
        // this.view.update(this.currentList);
        let list = this.db.queryGetList(this.state.currentList.key);
        this.db.mutationUpdateList(list);
        this.db.mutationUpdateSessionData(this.state.sessionData);
    }

    addChangeItemTransaction = (id, oldText, newText) => {
        // console.log(oldText)
        let transaction = new ChangeItem_Transaction(id, oldText, newText);
            //console.log(transaction) 
        this.tps.addTransaction(transaction)
        this.setState(prevState => ({

            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            sessionData: prevState.sessionData,
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }));
    }
    moveItem(oldIndex, newIndex) {
        this.state.currentList.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
    }

    makeMoveItem_Transaction(currentList, tps, start, target){
        // let current = currentList;
        // // current.items.splice(target-1, 0, current.items.splice(start-1, 1)[0]);

        // let moveTransaction = new MoveItem_Transaction(start, target);
        // const {oldIndex, newIndex} = tps.addTransaction(moveTransaction);
        
        // this.setState(prevState => ({

        //     currentList: current,
        //     listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
        //     sessionData: prevState.sessionData,
        //     canUndo: this.tps.hasTransactionToUndo(),
        //     canRedo: this.tps.hasTransactionToRedo()
        // }), () => {
        //     this.moveItem(oldIndex, newIndex)
        //     this.db.mutationUpdateList(current);
        //     this.db.mutationUpdateSessionData(this.state.sessionData)
        // });
    }


    renameItem = (key, newName) => {
        let currentList = this.state.currentList
        if(currentList.items[key] !== newName){
            const oldName = `${currentList.items[key]}`
            // console.log("Old Name:" + oldName)
            // console.log("New Name:" + newName)
            currentList.items[key]=newName
            this.addChangeItemTransaction(key, oldName, newName)
            // console.log("hasREDO: "+this.tps.hasTransactionToRedo())
            // console.log("hasUNDO: "+this.tps.hasTransactionToUndo())
            this.setState(prevState => ({
                currentList: prevState.currentList,
                listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: prevState.sessionData.keyNamePairs
                },
                canUndo: this.tps.hasTransactionToUndo(),
                canRedo: this.tps.hasTransactionToRedo()
            }), () => {
                
                let list = this.db.queryGetList(currentList.key)
                list.items[key]=newName
                this.db.mutationUpdateList(list);
                this.db.mutationUpdateSessionData(this.state.sessionData)
            });
        }
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }



    confirmDeleteListModal(listKeyPair, keyNamePairs){
        let current = this.state.currentList
        // console.log(current)
        // console.log(listKeyPair)
        if(current !== null){
            if(listKeyPair.key == current.key){
                current = null
            }
        }
        
        const newKeyNamePairs = keyNamePairs.filter(keyNamePair => keyNamePair != listKeyPair)

        this.setState(prevState => ({
            currentList: current,
            listKeyPairMarkedForDeletion: listKeyPair,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            },
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo()
        }), () => {
            this.hideDeleteListModal();
            this.db.mutationUpdateList(newKeyNamePairs);
            this.db.mutationUpdateSessionData(this.state.sessionData); 
        })
    }
    render() {
        return (
            <div id="app-root">
                <Banner
                    title='Top 5 Lister'
                    jsTPS={this.tps}
                    canUndo={this.state.canUndo}
                    canRedo={this.state.canRedo}
                    currentList={this.state.currentList} 
                    closeCallBack={this.closeCurrentList}
                    undoCallBack={this.undoList}
                    redoCallBack={this.redoList}
                 />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    jsTPS={this.tps}
                    currentList={this.state.currentList} 
                    renameItemCallback={this.renameItem}
                    moveItemCallback={this.makeMoveItem_Transaction}
                />    
                <Statusbar
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    confirmDeleteListModalCallback= {(keyNamePair) => {
                        this.confirmDeleteListModal(keyNamePair, this.state.sessionData.keyNamePairs)
                   }}
                />
            </div>
        );
    }
}

export default App;
