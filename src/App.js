import React, {Component} from 'react';
import './App.css';

let id = 1;
class App extends Component {
    constructor(props) {
        super(props)
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        this.state = {
            notelist: [
                {
                    id: 0,
                    text: '',
                    editing: false,
                    date:date
                }
            ],
        }
        this.addNote = this.addNote.bind(this);
        this.emitChange = this.emitChange.bind(this);
        this.delete = this.delete.bind(this);
        this.oninput = this.oninput.bind(this);
    }

    componentDidMount(){
        var notes = localStorage.getItem("notes");
        if (notes) {
            var obj = JSON.parse(notes);
            this.setState({notelist: obj});
        }

    }
    addNote() {
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let note = {
            id: id++,
            text: '',
            editing: false,
            date:date
        }
        this.setState({
            notelist: [
                ...this.state.notelist,
                note
            ]
        })
    }

    delete(e, noteid) {
        var array = [...this.state.notelist]; // make a separate copy of the array
        var index = array.findIndex(note => note.id === noteid);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({notelist: array},()=>{
                localStorage.setItem("notes",JSON.stringify(this.state.notelist));
            });
        }

    }

    oninput(e, noteid) {
        this.setState({
            notelist: this.state.notelist.map(
                (note, i) => note.id === noteid ? {...note, editing: true}
                    : note
            )
        });
    }

    emitChange(e, noteid) {
        var html = e.currentTarget.innerHTML;
        this.setState({
            notelist: this.state.notelist.map(
                (note, i) => note.id === noteid ? {...note, text: html, editing: false}
                    : note
            )
        },()=>{
            localStorage.setItem("notes",JSON.stringify(this.state.notelist));
        });
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <h1>Add Notes</h1>
                    <button onClick={this.addNote}>+</button>
                </div>
                {
                    this.state.notelist.map((note, index) => (
                        <div key={index} className="note_holder">
                            <div className="note_header">
                                <span>{note.date}</span>
                                <div>
                                    <span>{note.editing ? <img src={require('./edit.png')} width={20}/> : <img src={require('./check-mark.png')} width={16}/>}</span>
                                    <button onClick={(e) => this.delete(e, note.id)}>-</button>
                                </div>
                            </div>
                            <div className="note"
                                 contentEditable={true}
                                 suppressContentEditableWarning={true}
                                 dangerouslySetInnerHTML={{__html: note.text}}
                                 onInput={(e) => this.oninput(e, note.id)}
                                 onClick={(e) => this.oninput(e, note.id)}
                                 onBlur={(e) => this.emitChange(e, note.id)}
                            />
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default App;
