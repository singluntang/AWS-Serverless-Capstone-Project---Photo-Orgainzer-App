import '../App.css'
import React, { Component } from 'react'
import App  from '../App'
import { Route, Switch } from 'react-router-dom'
import Auth from '../auth/Auth'
import styled from 'styled-components';
import { stage } from '../config'

const Button = styled.button`
  cursor: pointer;
  background: transparent;
  font-size: 24px;
  border-radius: 8px;
  color: grey;
  border: 2px solid grey;
  margin: 0 1em;
  padding: 0.25em 1em;
  transition: 0.5s all ease-out;
  &:hover {
    background-color: lightgrey;
    color: black;
  }
`;
const LoginStyle = styled.div`
  position: fixed;
  display: flex;
  width: 700px;
  height: 500px;
  flex-direction: column;  
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -350px;
  align-items: center;  
`;
const NavMode = styled.div`
  font-family: verdana,arial,sans-serif;
  font-size: 50px;
`;
const NavLogo = styled.div`
  font-family: udagramLogo;
  font-size: 60px;
`;
const NavButton = styled.div`
  margin-top: 100px;
  margin-left: 300px; 
  `;


export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  screenWidth: number
  screenHeight: number
}

export default class Login extends Component<AppProps, AppState> {

  state: AppState = {
    screenWidth: 0,
    screenHeight: 0
  }

  constructor(props: AppProps) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin() {
   
        this.props.auth.login()

  } 

  render() {
    
    return (  
            <React.Fragment>
   
                      <LoginStyle>
                        {(stage.localeCompare("prod")!=0) && (
                            <NavMode>
                                Offline - Mode (stage - {stage})
                            </NavMode>
                        )}
                        <NavLogo>
                            Your Photo Organizer
                        </NavLogo>
                        <NavButton>
                              <Button onClick={this.handleLogin}>
                                Log In
                              </Button >                          
                        </NavButton>
                      </LoginStyle> 
              
            </React.Fragment>             
    )
  }

}
