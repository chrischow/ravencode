import React from 'react';
import { ToggleButton, Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";

/**
 * 
 * @param {boolean} props.diffEditor If diffeditor is on
 * @param {function} props.setDiffEditor 
 * @param {string} props.language The current Code language
 * @param {function} props.setLanguage
 * @param {array} props.allLanguages All the languages enabled
 * @returns 
 */
export default function Menubar(props) {

    function handleOnChange(e) {
        const {name, value, type, checked} = e.target;
        props.setDiffEditor(pData => checked);
    };

    function handleLangSelect(eventKey, event) {
        props.setLanguage(pLang => eventKey);
    }

    const navDropItems = props.allLanguages.map((x, idx) => {
        return (
            <NavDropdown.Item 
                active={x === props.language}
                key={x}
                eventKey={x}>
                {x}
            </NavDropdown.Item>
        )
    })
    
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#home">
                    <img 
                        src="./raven32.png"
                        height="30"
                        className='d-inline-block align-top'
                        />{' '}
                    RavenITE [RDO's integrated text editor]
                </Navbar.Brand>
                <Navbar.Collapse id="navbar">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        navbarScroll
                    >
                        <NavDropdown 
                            title={props.language} 
                            id="nav-dropdown"
                            onSelect={handleLangSelect}
                            >
                            {navDropItems}
                        </NavDropdown>
                    </Nav>
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