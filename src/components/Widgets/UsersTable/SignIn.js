import React from 'react';

export default ({ email, password, onSubmit, onChange }) => {
    return (
        <div >
            <form onSubmit={(event)=>onSubmit(event)}>
                <label>Email:
            <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event)=>onChange(event)}
                    />
                </label>

                <label>Password:
            <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event)=>onChange(event)}
                    />
                </label>

                <button type="submit">Sign in</button>
            </form>
        </div >
    );
};