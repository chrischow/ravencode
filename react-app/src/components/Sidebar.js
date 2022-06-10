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
import { UploadFile, Link, ReportProblemSharp } from '@mui/icons-material';
import Explorer from './Explorer';
import { RavencodeFolderData, SharepointUtil } from '../util/SharepointUtil';

const drawerWidth = 400;

const Input = styled('input')({
    display: 'none',
})

/**
 * 
 * @param {function} props.handleCodeFileChange Handle the change in code for the editor.
 * @param {[RavencodeFolderData]} props.treeData This is the data for the tree to render.
 * @param {string} props.siteUrl Sharepoint site Url.
 * @param {function} props.setSiteUrl
 * @param {function} props.setTreeData
 * @returns 
 */
export default function Sidebar(props) {
    
    const localFile = "";
    
    function handleCodeLoad(event) {
        event.preventDefault();
        console.log(event);
    }

    function handleSiteUrl(event) {
        props.util.setSiteUrl(props.siteUrl);
        props.util.getFileObjFrom()
            .then((results)=>{
                props.setTreeData(pData => results);
            })
            .catch((err) => {
                props.setAlertOptions(opt => {
                    return {
                        open: true,
                        message: `${err.name}: ${err.message}`,
                        severity: 'error'
                    }
                })
                console.error(err);
            });
    }

    function handleSiteUrlChange(event) {
        props.setSiteUrl(pData => event.target.value);
    }

    function handleDrawerClose(event) {
        if (event.type === 'keydown' && (event.key ==='Tab' || event.key ==='Shift')) {
            return;
        }

        props.setDrawerState(pData => false);
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
        open={props.drawerState}
        onClose={handleDrawerClose}
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
                    onChange={handleSiteUrlChange}
                    fullWidth
                >
                    {props.siteUrl}
                </TextField>
                <ListItemButton onClick={handleSiteUrl} disableGutters sx={{ ml: 1   }}>
                    <ListItemIcon>
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
            <Explorer 
                treeData={props.treeData} 
                setCode={props.setCode} 
                setOriginalCode={props.setOriginalCode}
                setEditorFns={props.setEditorFns}
                setAlertOptions={props.setAlertOptions}
                util={props.util}/>
        </List>
      </Drawer>
  );
}
