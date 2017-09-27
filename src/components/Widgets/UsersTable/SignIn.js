import React from 'react';
import './styles.css';

export default ({ email, password, onSubmit, onChange }) => {
    return (
        <div >
            <form onSubmit={(event)=>onSubmit(event)} >
				<table className='signin'>
                <tr>
					<td>Email:</td>
					<td><input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event)=>onChange(event)}
                    /></td>
                </tr>
				<tr>
					<td>Password:</td>
					<td><input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event)=>onChange(event)}
                    /></td>
                </tr>
				<tr>
					<td></td>
					<td><button type="submit">Sign in</button></td>
				</tr>
				</table>
            </form>
        </div >
    );
};