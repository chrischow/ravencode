import React from 'react';
import { ToggleButton, Container, Nav, Navbar, Button } from "react-bootstrap";
import raven_logo from './raven_logo.svg';

/**
 * 
 * @param {boolean} props.diffEditor If diffeditor is on
 * @param {function} props.setDiffEditor 
 * @returns 
 */
export default function Menubar(props) {

    function handleOnChange(e) {
        const {name, value, type, checked} = e.target;
        props.setDiffEditor(pData => checked);
    };
    
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#home">
                    <img 
                        src={raven_logo}
                        height="30"
                        className='d-inline-block align-top'
                        />{' '}
                    RavenITE [RDO's integrated text editor]
                </Navbar.Brand>
                <Navbar.Collapse id="navbar">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        navbarScroll
                    ></Nav>
                    <Nav>
                        <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            onChange={handleOnChange}
                            checked={props.diffEditor}
                            value="1"
                            variant="outline-primary">
                            Diff Editor {props.diffEditor ? "ON" : "OFF"}
                        </ToggleButton>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}