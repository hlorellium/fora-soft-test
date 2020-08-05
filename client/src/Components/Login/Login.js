import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Login.css';
const { v4: uuidV4 } = require('uuid');



const Login = (props) => {
    let location = useLocation();
    let history = useHistory();

    // Store previous url if you were redirected
    let { from } = location.state || { from: { pathname: '/' } };

    const handleChange = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <div className="wrapper">
            <div className="joinBlock">
                <h1 className="heading">Enter your name</h1>
                <form className="loginForm">
                    <input
                      placeholder="Name"
                      className="loginInput"
                      type="text"
                      value={props.name}
                      onChange={handleChange}
                      autoFocus
                    />

                    <button
                      type="submit"
                      className="loginBtn"
                      onClick={(e) => {
                          e.preventDefault();
                          from.pathname.length > 1
                            ? history.replace(from)
                            : history.replace(uuidV4());
                      }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
