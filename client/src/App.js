import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import Login from './Components/Login/Login';
import Room from './Components/Room/Room';

const App = () => {
    const [name, setName] = useState('');

    const handleChange = (newName) => {
        setName(newName);
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Login name={name} onChange={handleChange} />
                </Route>
                <PrivateRoute path="/:roomId" name={name}>
                    <Room name={name} />
                </PrivateRoute>
            </Switch>
        </Router>
    );
};

const PrivateRoute = ({ children, name, ...rest }) => {
    useEffect(() => console.log(name));

    return (
        <Route
            {...rest}
            render={({ location }) =>
                name ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default App;
