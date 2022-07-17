import React, { Component } from "react";
import { Form, FormGroup, FormControl, ControlLabel, Col } from "react-bootstrap";
import { Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import axios from "axios";
import './Music.css';

//todo:
//1. add css to make pretty
//2. add error messages when users messes up


class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mess: "",
      activeItem: {
        id: 0,
        song: "",
        artist: "",
        rating: 0,
      },
      infoList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }
  
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/info")
      .then((res) => this.setState({ infoList: res.data}))
      .catch((err) => console.log(err));
  };

  onChangeSongName = (e) =>{
    this.setState({song: e.target.value})
  }

  onChangeArtist = (e) =>{
    this.setState({artist: e.target.value})
  }

  onChangeRating = (e) =>{
    this.setState({rating: e.target.value})
  }

  addNew = (e) =>{
    
    // console.log(this.state.song)
    // console.log(this.state.artist)
    // console.log(this.state.rating)
    // console.log(typeof String(localStorage.getItem('user')))
    e.preventDefault();

    const data = this.state.infoList
    const filt = data.filter(info => info.song === this.state.song)
    // console.log(filt)
    // console.log(filt.length)
    const filtt = filt.filter(info => info.user === String(localStorage.getItem('user')))
    // console.log(filtt.length)
    console.log(typeof data.length)

    if (filtt.length === 1) {
      this.setState({mess: 'user already added this song'})
      // console.log(this.state.mess)
    } else{
      const item = {
        id: data.length + 1,
        song: this.state.song,
        artist: this.state.artist,
        rating: parseInt(this.state.rating),
        user: String(localStorage.getItem('user'))
      }

      var k;
      var arr = [];
      for (k = 0; k < data.length; ++k) {
        // console.log(data[k].id)
        arr.push(data[k].id)
      }

      while (arr.includes(item.id)){
        item.id = item.id + 1
      }



      // console.log(item)
      axios
        .post("http://localhost:8000/api/info/", item)
        .then((res) => { this.refreshList(); })
        .catch((err) => console.log(err));
      
      
      
      
      }
  }

  renderNewSong(){
    return(
      <form onSubmit = {e => this.addNew(e)}>
        <label htmlFor = 'songTitle' >Song Title</label>
        <input type = 'text' name = 'songTitle' required onChange = {this.onChangeSongName}/>< br/> < br/>
        <label htmlFor = 'artist'>Artist</label>
        <input type = 'text' name = 'artist' required onChange = {this.onChangeArtist}/> < br/> < br/>
        <label htmlFor = 'rating'>Rating (1 - 5)</label>
        <input type = 'range' min = '1' max = '5' name = 'rating' required onChange = {this.onChangeRating}/> < br/> < br/>
        <Button>Add Song</Button>
      </form>
    )
  }


  toggle = () => {
    // We have a modal view below in the render() function.
    // Upon toggle, set the modal to false, i.e., do not show the modal.
    this.setState({ modal: !this.state.modal });
  };




  editInfo = (e) =>{
    e.preventDefault();
    // console.log()

    const data = this.state.infoList
    // console.log('check')

    // console.log(this.state.song)
    //check if user has already rated song
    const filt = data.filter(info => info.song === this.state.song && info.user === String(localStorage.getItem('user')))
    
    const len = filt.length
    if (len === 1){
      const item = {
        id: Object.values(filt[0])[0],
        song: this.state.song,
        artist: this.state.artist,
        rating: this.state.rating,
        user: String(localStorage.getItem('user'))
      };
      // console.log('id: '+ item.id);
      axios
        .put(`http://localhost:8000/api/info/${item.id}/`, item)
        .then((res) => {this.refreshList();})
        .then((res) => {this.toggle();})
    }
    else{
      console.log('Already rated');
      this.setState({mess: 'Song has already been rated'})
    }
  }

  renderEditSong(){
    return(
      <form onSubmit = {e => this.editInfo(e)}>
        <label htmlFor = 'songTitle'>Song Title</label>
        <input type = 'text' name = 'songTitle' onChange = {this.onChangeSongName}/>< br/> 
        <label htmlFor = 'artist'>Artist</label>
        <input type = 'text' name = 'artist' onChange = {this.onChangeArtist}/> < br/> 
        <label htmlFor = 'rating'>Rating (1 - 5)</label>
        <input type = 'range' min = '1' max = '5' name = 'rating' onChange = {this.onChangeRating}/> < br/> 
        <Button>Edit Song</Button>
      </form>
    )
  }




  deleteMe = (e) =>{
    e.preventDefault();
    // this.refreshList();
    const data = this.state.infoList
    // console.log(data)

    const filt = data.filter(info => info.song === this.state.song)
    // console.log(Object.values(filt[0]));
    const filtt = filt.filter(info => info.user === String(localStorage.getItem('user')))
    const len = filtt.length
    // console.log('values: '+ Object.values(filtt[0]));

    if (len === 1){
      // console.log(typeof Object.values(filtt[0]));
      // console.log(Object.values(filtt[0])[0]);
      const rm_id = Object.values(filtt[0])[0]
      axios
        .delete(`http://localhost:8000/api/info/${rm_id}`)
        .then((res) => {this.refreshList();})
        .then((res) => {this.toggle();})
    } else {
      this.setState({mess: 'user has not added this song with rating. Please do so first.'})
      // console.log(this.state.mess)
    }
  }

  renderDeleteSong(){
    return(
      <Form onSubmit = {e => this.deleteMe(e)}>
        <label htmlFor = 'songTitle'>Song Title</label>
        <input type = 'text' name = 'songTitle' onChange = {this.onChangeSongName}/>< br/> < br/>
        <Button>Remove Song</Button>
      </Form>
    )
  }

  renderSongView(){
    //modify list here
    const data = this.state.infoList
    let rend = []


    const unique = [...new Set(data.map(item => item.song))];
    console.log('unique: '+unique)
    var k;
    for (k = 0; k < unique.length; ++k) {
      const oki = data.filter(info=> info.song === unique[k])
      console.log('here now')
      // console.log(oki)
      var i;
      var j = 0;
      for (i = 0; i < oki.length; ++i){
        const rm_id = Object.values(oki[i])[3]
        // console.log(rm_id)
        j = j + rm_id
      }
      var avg = j / oki.length
      console.log(avg)
      const work = Object.values(oki[0])[2];
      const add = {
        song: unique[k],
        artist: Object.values(oki[0])[2],
        rating: avg
      }
      console.log(add)
      rend.push(add)
    }

    return (
      <Table>
        <thead>
          <tr>
          <th>song title</th>
          <th>artist</th>
          <th>rating</th>
          </tr>
        </thead>
        {rend.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.song}</td>
              <td>{val.artist}</td>
              <td>{val.rating}</td>
            </tr>
          )
        })}
      </Table>
    )}


    renderErr(){      
      console.log('current error message is: ' + this.state.mess)
      return(
          this.state.mess
      )
  }


  render(){

    return(
      
      <div id = 'base div'>
        {this.renderErr()}
        <div id = 'display-table'>
        </div>
        <div id = 'new song'>
          <h1>Add a new song!</h1>
          {this.renderNewSong()}
        </div>
        <div id = 'song view'>
          <h1>See the songs!</h1>
          {this.renderSongView()}
        </div>
        <div id = 'song edit'>
          <h1>Edit a song!</h1>
          {this.renderEditSong()}
        </div>
        <div id = 'song delete'>
          <h1>Delete a song!</h1>
          {this.renderDeleteSong()}
        </div>
        
      </div> 
           
    )
  }
}


export default Music;