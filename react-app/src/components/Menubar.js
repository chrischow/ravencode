import React from 'react';

import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { ToggleButtonGroup, ToggleButton, Box, IconButton, Tooltip } from '@mui/material';
import { VerticalSplit, Api, PlayCircle, Save } from '@mui/icons-material'
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
 * @param {boolean} props.addEditor If diffeditor is on
 * @param {function} props.setAddEditor 
 * @param {string} props.language The current Code language
 * @param {function} props.setLanguage
 * @param {array} props.allLanguages All the languages enabled
 * @returns 
 */
export default function Menubar(props) {

    function handleOnChange(e, value) {
        props.setAddEditor(pData => value);
    };
    
    function handleSave(e, value) {
        props.editorFns.saveCodeFn();
    }
  
    function handleEval(e, value) {
        eval(props.code);
    }

    return (
        <ElevationScroll {...props}>
            <AppBar 
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar variant="dense">
                    <IconButton sx={{ pl: 0 }}>
                        <img src="./raven32.png"/>
                    </IconButton>
                    <Typography 
                        variant="subtitle1" 
                        nowrap="true" 
                        component="div" 
                        sx={{ mr: 1 }}
                    >
                        Ravencode
                    </Typography>
                    <Typography 
                        variant="subtitle2" 
                        nowrap="true" 
                        component="div" 
                        sx={{ mr: 4}}
                        color="secondary"
                    >
                        .::RDO's integrated text editor::.
                    </Typography>
                    {props.addEditor !== "apiTestor" &&
                    <LanguageMenu {...props}/>}
                    <Box sx={{ flexGrow: 1}}/>
                    {props.editorFns.saveFilePath &&
                    <Tooltip title={`Save to ${props.editorFns.saveFilePath}`}>
                        <IconButton sx={{ pl: 3 }} onClick={handleSave}>
                            <Save color="secondary"/>
                        </IconButton>
                    </Tooltip>}
                    {props.language === "javascript" &&
                    <IconButton sx={{ pl: 1 }} onClick={handleEval}>
                        <PlayCircle color="danger"/>
                    </IconButton>}
                    <ToggleButtonGroup 
                        onChange={handleOnChange} 
                        exclusive
                        value={props.addEditor}
                    >
                        <Tooltip title="API Testor">
                            <ToggleButton value="apiTestor" size="small" color="info">
                                <Api />
                            </ToggleButton> 
                        </Tooltip>
                        <Tooltip title="Diff Editor">
                            <ToggleButton value="diffEditor" size="small" color="info">
                                <VerticalSplit />
                            </ToggleButton> 
                        </Tooltip>
                    </ToggleButtonGroup>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    )
}