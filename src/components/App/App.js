import './styles.scss';

import React from 'react';

import { TopPanel } from '../Widgets/TopPanel';
import { UsersTable } from '../Widgets/UsersTable';

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <TopPanel />
                <UsersTable/>
            </div>
        );
    }
}

export default App;
