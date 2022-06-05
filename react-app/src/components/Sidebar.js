import * as React from 'react';
import Box from '@mui/material/Box';
import { Drawer, ListSubheader, Toolbar, TextField } from '@mui/material';
import { styled } from '@mui/material/styles'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { UploadFile, Link } from '@mui/icons-material';
import Explorer from './Explorer';
import { RavencodeFolderData } from '../util/SharepointUtil';

const drawerWidth = 240;

const Input = styled('input')({
    display: 'none',
})

/**
 * 
 * @param {function} props.handleCodeFileChange Handle the change in code for the editor.
 * @param {[RavencodeFolderData]} props.treeData This is the data for the tree to render.
 * @returns 
 */
export default function Sidebar(props) {

    function handleCodeLoad(event) {
        event.preventDefault();
        console.log(event);
    }

  return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
            <ListItem disablePadding>
                <label htmlFor='contained-button-file'>
                    <Input 
                        accept=".txt,.html" 
                        id="contained-button-file" 
                        type="file"
                        onChange={props.handleCodeFileChange}
                    />
                    <ListItemButton>
                        <ListItemIcon>
                            <UploadFile />
                        </ListItemIcon>
                        <ListItemText primary="Read Local File"/>
                    </ListItemButton>
                </label>
            </ListItem>
        </List>
        <Divider />
        <List
            component="nav"
            aria-labelledby='nested-list-subheader'
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Sharepoint Settings
                </ListSubheader>
            }
        >
            <ListItem dense={true}>
                <TextField 
                    label="Set URL" 
                    id="outline-size-small" 
                    size="small"
                />
                <ListItemButton disablePadding disableGutters>
                    <ListItemIcon sx={{ pl: 2 }}>
                        <Link />
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        <List
            component="nav"
            aria-labelledby='nested-explorer-subheader'
            subheader={
                <ListSubheader component="div" id="nested-explorer-subheader">
                    Sharepoint EXPLORER
                </ListSubheader>
            }
        >
            <Explorer treeData={props.treeData}/>
        </List>
      </Drawer>
  );
}
