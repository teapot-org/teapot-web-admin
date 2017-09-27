import React from 'react';
import axios from 'axios';
import SignIn from './SignIn';
import Editor from './Editor';

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
                name: null,
                lastName: null,
                firstName: null,
                email: null,
                birthday: null,
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
        this.loadData();
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

    onChangeActive(event) {
        let target = event.target;
        let value = (target.type === 'checkbox') ? target.checked : target.value;
        let name = target.name;

        this.setState({ activeUser: { [name]: value } });
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
                    name: `${activeUser.name}`,
                    firstname: `${activeUser.firstname}`,
                    lastname: `${activeUser.lastname}`,
                    email: `${activeUser.email}`,
                    birthday: `${activeUser.birthday}`,
                    description: `${activeUser.description}`,
                },
            }).then(this.loadData()).catch(response => console.log(response));

            this.setState({ activeUser: { active: false } });
        }
    }

    onSubmit(event) {
        event.preventDefault();

        const { email, password } = this.state;

        axios({
            method: 'post',
            url: 'http://localhost:8080/oauth/token',

            /* headers: {
               'Authorization': `Basic ${btoa('client:secret')}`,
             },*/

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
        });
    }

    banUser(user) {
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
        }).then(this.loadData()).catch(response => console.log(response));


    }

    Activate(user) {
        this.setState({
            activeUser: {
                active: true,
                name: `${user.name}`,
                lastName: `${user.lastName}`,
                firstName: `${user.firstName}`,
                email: `${user.email}`,
                birthday: `${user.birthday}`,
                description: `${user.description}`,
                link: `${user._links.self.href}`,
            },
        });
        console.log(this.state.activeUser);
    }

    render() {
        const { accept, email, password  } = this.state;
        if (accept) {
            return (
                <div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Authority</td>
                                <td>Username</td>
                                <td>First Name</td>
                                <td>Last Name</td>
                                <td>Email</td>
                                <td>Birthday</td>
                                <td>Description</td>
                                <td>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                this.state.users.map((user) => {
                                    return <tr key={user.name} onClick={() => this.Activate(user)}>
                                        <td>{user.authority}</td>
                                        <td>{user.name}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.birthday}</td>
                                        <td>{user.description}</td>
                                        <td>{act(user)}</td>
                                        <td>
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