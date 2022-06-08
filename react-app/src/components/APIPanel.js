import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Send } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Typography, ToggleButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function APIPanel(props) {
    const [apiOptions, setApiOptions] = React.useState({
        api_method: "get",
        url: "",
        async: true
    });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menu_apimethod = ['get', 'post', 'put', 'delete'];

    function handleUrlChange(event, value) {
        setApiOptions(opts => {
            return {
                ...opts,
                url: event.target.value
            };
        });
    }

    return (
    <Paper
      component="form"
      sx={{ m: '10px', p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            
            <Typography variant='body2' color="secondary">{apiOptions.api_method.toUpperCase()}</Typography>
            <ArrowDropDownIcon color='secondary'/>
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            {menu_apimethod.map((item) => {
                return (
                    <MenuItem onClick={() => {
                        handleClose();
                        setApiOptions(opts => {return {...opts, api_method: item}});
                    }} key={item}>
                        <Typography variant='body2' color="secondary">{item.toUpperCase()}</Typography>
                    </MenuItem>
                )
            })}
        </Menu>
        <Divider sx={{ height: 28, mr: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Enter REST API url"
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={handleUrlChange}
      >{apiOptions.url}</InputBase>
    <ToggleButton
        size="small"
        value="check"
        color="secondary"
        selected={apiOptions.async}
        onChange={() => {
            setApiOptions(opts => {
                return {
                    ...opts,
                    async: !opts.async
                };
            });
        }}
    >
        <Typography variant='body2'>{apiOptions.async ? "Async" : "Sync"}</Typography>
    </ToggleButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <Send />
      </IconButton>
    </Paper>
  );
}
