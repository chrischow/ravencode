import React from 'react';

import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { ToggleButton, Box, IconButton } from '@mui/material';
import { VerticalSplit } from '@mui/icons-material'
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
        props.setDiffEditor(pData => !pData);
    };
  
    return (
        <ElevationScroll {...props}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar variant="dense">
                    <IconButton>
                        <img src="./raven32.png"/>
                    </IconButton>
                    <Typography variant="h7" nowrap="true" component="div" sx={{ mr: 2 }}>
                        Ravencode [RDO's integrated text editor]
                    </Typography>
                    <LanguageMenu {...props}/>
                    <Box sx={{ flexGrow: 1}}/>
                    <ToggleButton
                        value="check"
                        selected={props.diffEditor}
                        onChange={handleOnChange}
                        size="small"
                    >
                        <VerticalSplit />
                    </ToggleButton> 
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    )
}