import React from 'react';

import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
import { ToggleButton, Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LanguageMenu from './LanguageMenu';

function ElevationScroll(props) {
    const { children } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired
};
  

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
                        <LanguageMenu {...props}/>
                    </Nav>
                    <Nav>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch 
                                    checked={props.diffEditor}
                                    onChange={handleOnChange}
                                    inputProps={{ 'aria-label': 'controlled'}}
                                    />
                                }
                                label="Diff Editor"
                                />
                        </FormGroup>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}