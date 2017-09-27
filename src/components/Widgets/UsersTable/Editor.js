import React from 'react';

export default ({ activeUser, onChangeActive, onSubmitActive }) => {
    if (!activeUser.active) { return < h1 > Select user to edit...</h1 >; }

    return (
        <div >
            <form onSubmit={(event) => onSubmitActive(event)}>
                    <table>
                        <thead>
                            <tr>
                                <td>Username</td>
                                <td>First Name</td>
                                <td>Last Name</td>
                                <td>Email</td>
                                <td>Birthday</td>
                                <td>Description</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        name="name"
                                        type="name"
                                        value={activeUser.name}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                                <td>
                                    <input
                                        name="firstName"
                                        type="firstName"
                                        value={activeUser.firstName}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                                <td>
                                    <input
                                        name="lastName"
                                        type="lastName"
                                        value={activeUser.lastName}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                                <td>
                                    <input
                                        name="email"
                                        type="email"
                                        value={activeUser.email}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                                <td>
                                    <input
                                        name="birthday"
                                        type="birthday"
                                        value={activeUser.birthday}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                                <td>
                                    <input
                                        name="description"
                                        type="description"
                                        value={activeUser.description}
                                        onChange={(event) => onChangeActive(event)} />
                                </td>
                            </tr>
                        </tbody>
                  </table>
                  <button type="submit">Save</button>
            </form>
        </div >
    );
};