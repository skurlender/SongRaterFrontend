import React, { setState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from 'axios';
import './Login.css';



class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ok: false,
        mess: '',
          activeItem: {
              user: "",
              pass: "",
              mess: "",
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
        this.refreshList()
        // this.state.mess = '';

        // console.log(this.state.user)
        // console.log(this.state.userList);
        
        const data = this.state.userList
        // console.log(data)

        var k;
        for (k = 0; k < data.length; ++k) {
            // console.log(data[k])
            // console.log(data[k].username)
            if (data[k].username === this.state.user){
                console.log('user exists')
                if (data[k].password === this.state.pass) {
                    console.log('pass correct');
                    this.setState({ok: true})
                    //console log here
                    // const u = {user}
                    localStorage.setItem("user", this.state.user)
                } else {
                    console.log('pass incorrect');
                    this.setState({mess: 'password incorrect for this user'})
                }
            }
        }

        if (this.state.mess === '') {
            console.log('out here')
            this.setState({mess: 'username not in database'})
        }
    }

    renderErr(){
        console.log('check')
        console.log(this.state.mess)
        return(
            this.state.mess
        )
    }

    renderLogin(){

        return(          
            <form onSubmit = {e => this.checkuser(e)}>

            <label htmlFor = 'username'>Username</label>
            <input type = 'text' required name = 'user' onChange = {this.onChangeUser}/>< br/> < br/>
            
            <label htmlFor = 'password'>Password</label>
            <input type = 'text' required name = 'pass' onChange = {this.onChangePass}/> < br/> < br/>

            <button>Sign In</button>

          </form>

        )
    }

    hehe(){
        console.log('made it!')
    }

    render(){
        if (this.state.ok === false){
            return(
                <div>
                    {this.renderErr()}
                    <h1>Login</h1>
                    <div id = 'Login'>
                        {this.renderLogin()}
                    </div>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <Link to="register"> Register</Link>        
                            </span>
                        </p>
                </div>
            )
        } else {
            {this.hehe()}
            return (<Navigate to={'music'}/>)
        }
    }
}


export default Login