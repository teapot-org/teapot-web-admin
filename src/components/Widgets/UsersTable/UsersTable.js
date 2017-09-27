import React from 'react';
import axios from 'axios';
import SignIn from './SignIn';
import Editor from './Editor';
import './styles.css';

function act(user) { if (user.available) { return "Active" } else { return "Disactive" } }

const ACCESS_TOKEN_KEY = 'access_token';

function setAccessToken(access_token)
{
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

class UsersTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            accept: false,
            email: '',
            password: '',
            activeUser: {
				
                active: false,
				Authority: null,
                name: null,
                lastName: null,
                firstName: null,
                email: null,
                description: null,
                link: null,
            },
        };

        this.banUser = this.banUser.bind(this);
        this.Activate = this.Activate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeActive = this.onChangeActive.bind(this);
        this.onSubmitActive = this.onSubmitActive.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        axios.get('http://localhost:8080/users').then(response => {
            const users = response.data._embedded.owners;
            this.setState({ users });
        }).catch(error => console.log(error));
    }

    onChange(event) {
        const target = event.target;
        const value = (target.type === 'checkbox') ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value });
    }

    onChangeActive(event, activeUser1) {
        let target = event.target;
        let value = (target.type === 'checkbox') ? target.checked : target.value;
        let name = target.name;

        let tmp = this.state.activeUser;
        Object.assign(tmp, { [name]: value });
    
        this.setState({
            activeUser:
            {
				authority: `${tmp.authority}`,
                active: `${tmp.active}`,
                name: `${tmp.name}`,
                lastName: `${tmp.lastName}`,
                firstName: `${tmp.firstName}`,
                email: `${tmp.email}`,
                description: `${tmp.description}`,
                link: `${tmp.link}`,
            },
            });
    
    }

    onSubmitActive(event) {
        event.preventDefault();

        const { activeUser } = this.state;
        if (activeUser.active) {
            axios({
                method: 'patch',
                url: `${activeUser.link}`,
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                },
                params: {
					authority: `${activeUser.authority}`,
                    name: `${activeUser.name}`,
                    firstName: `${activeUser.firstName}`,
                    lastName: `${activeUser.lastName}`,
                    email: `${activeUser.email}`,
                    description: `${activeUser.description}`,
                },
            }).then(response => console.log(response)).catch(response => console.log(response));

            this.setState({ activeUser: { active: false } });
        }
    }

    onSubmit(event) {
        event.preventDefault();

        const { email, password } = this.state;

        axios({
            method: 'post',
            url: 'http://localhost:8080/oauth/token',


            params: {
                username: email,
                password: password,
                grant_type: 'password',
                client_id: 'client',
                client_secret: 'secret',
            },
        }).then(response => {
                    setAccessToken(response.data.access_token);
                    this.setState({ accept: true });
        }).catch(()=>alert("Wrong email or password"));
    }

    banUser(user) {
		if(user.authority!="ADMIN"){
        axios({
            method: 'patch',
            url: `${user._links.self.href}`,
            headers:
            {
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            },
            params: {
                available: `${!user.available}`,
            },
        }).then(this.loadData()).catch(response => console.log(response));}
		else{
			alert("This name have authority like 'ADMIN'. Operation failed.");
		}
    }

    Activate(user) {
        this.setState({
            activeUser: {
				authority: `${user.authority}`,
                active: true,
                name: `${user.name}`,
                lastName: `${user.lastName}`,
                firstName: `${user.firstName}`,
                email: `${user.email}`,
                description: `${user.description}`,
                link: `${user._links.self.href}`,
            },
        });
    }

    render() {
        const { accept, email, password } = this.state;
        this.loadData();
        if (accept) {
            return (
                <div>
                <div>
                    <table className='usertable'>
                        <thead>
                            <tr>
                                <td className='usertable'>Authority</td>
                                <td className='usertable'>Username</td>
                                <td className='usertable'>First Name</td>
                                <td className='usertable'>Last Name</td>
                                <td className='usertable'>Email</td>
                                <td className='usertable'>Description</td>
                                <td className='usertable'>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                this.state.users.map((user) => {
                                    return <tr key={user.name} onClick={() => this.Activate(user)}>
                                        <td className='usertable'>{user.authority}</td>
                                        <td className='usertable'>{user.name}</td>
                                        <td className='usertable'>{user.firstName}</td>
                                        <td className='usertable'>{user.lastName}</td>
                                        <td className='usertable'>{user.email}</td>
                                        <td className='usertable'>{user.description}</td>
                                        <td className='usertable'>{act(user)}</td>
                                        <td className='usertable'>
                                            <button onClick={() =>this.banUser(user)}>Ban</button>
                                        </td>
                                </tr>;
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div >{
                    <Editor activeUser={this.state.activeUser} onChangeActive={this.onChangeActive} onSubmitActive={this.onSubmitActive} />}
                </div>
                </div>
            );
        }
        else {
            return (
                <SignIn email={email} password={password} onSubmit={this.onSubmit} onChange={this.onChange} />);
        }
    } 
}

export default UsersTable;