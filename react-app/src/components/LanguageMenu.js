import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CodeIcon from '@mui/icons-material/Code';

/**
 * 
 * @param {boolean} props.diffEditor If diffeditor is on
 * @param {function} props.setDiffEditor 
 * @param {string} props.language The current Code language
 * @param {function} props.setLanguage
 * @param {array} props.allLanguages All the languages enabled
 * @returns 
 */
export default function LanguageMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };
  const handleMenuItemClose = (e) => {
    handleClose(e);
    props.setLanguage(prevLang => e.target.id);
  }

  const menuItems = props.allLanguages.map((x,idx) => {
    return (
      <MenuItem key={x} id={x} onClick={handleMenuItemClose}>{x}</MenuItem>
    )
  });
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<CodeIcon />}
        variant="contained"
        size="small"
        color="secondary"
        sx={props.sx}
      >
        {props.language}
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
        {menuItems}
      </Menu>
    </>
  );
}
