import React, { setState } from "react";
import axios from "axios"
import  { Navigate, Link } from 'react-router-dom'
import './Register.css';


//todo when a user already exists in db let them know

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ok: false,
            mess: '',
            activeItem: {
                user: "",
                pass: "",
              },
              userList: [],
          };
      }
  
    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
    axios
      .get("http://localhost:8000/api/users/")
      .then((res) => this.setState({ userList: res.data}))
      .catch((err) => console.log(err));
    };

    onChangeUser = (e) =>{
        this.setState({user: e.target.value})
    }

    onChangePass = (e) =>{
        this.setState({pass: e.target.value})
    }

    checkuser = (e) =>{
        e.preventDefault();
        
        const data = this.state.userList
        
        var k;
        for (k = 0; k < data.length; ++k) {
            if (data[k].username === this.state.user){
                console.log('not allowed bc user exists')
                this.setState({mess: 'user already exists'})
            }
        }
    
        if (this.state.mess === '') {
            console.log('ADDING USER')
            axios.post("http://localhost:8000/api/users/", {
                username: this.state.user,
                password: this.state.pass
            })
            .then((res) => this.refreshList());
            this.setState({ok: true})
        }

    }

    renderRegistration(){
        return(

            <form onSubmit = {e => this.checkuser(e)}>

            <label htmlFor = 'username'>Username</label>
            <input type = 'text' required name = 'user' onChange = {this.onChangeUser}/>< br/> < br/>
            
            <label htmlFor = 'password'>Password</label>
            <input type = 'text' required name = 'pass' onChange = {this.onChangePass}/> < br/> < br/>

            <button>Register</button>

          </form>

        )
    }

    renderErr(){
        return(
            this.state.mess
        )
    }

    render(){
        // console.log('hi')
        if (this.state.ok === false){
            console.log('hi')
            return(
                <div>
                    {this.renderErr()}
                    <h1>User Registration</h1>
                    <div id = 'Register'>
                        {this.renderRegistration()}
                    </div>
                    <p>
                        Already have an account?<br />
                        <span className="line">
                            <Link to="/"> Login</Link>
                        </span>
                    </p>
                </div>
            )
        } else {
            this.refreshList()
            console.log(this.state.userList)
            return (<Navigate to={'/'}/>)
        }
    }
}



export default Register