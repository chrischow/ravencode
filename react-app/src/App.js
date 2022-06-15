import "./App.css";
import React from 'react';
import { useState, useEffect, useRef } from "react";

import AceEditor from 'react-ace';
import { diff as DiffEditor } from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-vbscript";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import Menubar from "./components/Menubar";
import Sidebar from "./components/Sidebar";
import { Box, Toolbar, CssBaseline, Container, Stack, Paper, Typography, Chip } from "@mui/material";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import ConsoleFeed from "./components/ConsoleFeed";
import APIPanel from "./components/APIPanel";
import { DataObject } from "@mui/icons-material";
import { useTabsList } from "@mui/base";
import { SharepointUtil } from "./util/SharepointUtil";

function loadBlob(filename) {
  var xhr = new XMLHttpRequest();
  var url = new URL(`${filename}.txt`,window.location.href)
  xhr.open("GET", url, false);
  xhr.send();
  return xhr.responseText;
}

const txtUrl = "";

const getCode = (url, filename, callback) => {
  // Retrieve text
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(this.responseText);
    }
  };

  var url = url + filename + ".txt";
  xhr.open("GET", url);
  xhr.send();
}

const languagesWithValidation = [
  "html",
  "javascript",
  "json",
  "css",
  "vbscript",
  "jsx"
]

const allLanguages = [
  ...languagesWithValidation,
  "xml",
  "sql",
  "markdown"
]

const darkTheme = createTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#58a5f0',
      main: '#0277bd',
      dark: '#004c8c',
      contrastText: '#ffffff',
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  ...theme.typography.body2,
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  // State
  const [siteUrl, setSiteUrl] = useState(txtUrl);
  const [code, setCode] = useState("");
  const [addEditor, setAddEditor] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [originalCode, setOriginalCode] = useState("");
  const [isDarkMode, setDarkMode] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [apiBody, setApiBody] = useState(null);
  const [util, setUtil] = React.useState(new SharepointUtil());
  const [drawerState, setDrawerState] = React.useState(false);
  const [editorFns, setEditorFns] = useState({
    saveFilePath: null,
    saveCodeFn: null
  });
  const [alertOptions, setAlertOptions] = useState({
    open: false,
    message: "",
    severity: "info"
  })

  const debugConsoleFeed = false;
  
  const handleCodeFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      setCode(pCode => e.target.result);
      setOriginalCode(pCode => e.target.result);
    }
    reader.readAsText(file);
  };

  function saveCode() {
    if(editorFns.saveFilePath){
      // console.log("init save");
      setAlertOptions(pOpt => {
        return {
          open: true,
          message: `Saving to ${editorFns.saveFilePath}`,
          severity: "info"
        }
      });
      util.updateTextFile(editorFns.saveFilePath, code)
        .then((request) => {
        //   console.log(request.status);
          setAlertOptions(pOpt => {
            return {
              open: true,
              message: `Saved to ${editorFns.saveFilePath}!`,
              severity: "success"
            }
          })
          .catch((err) => {
            console.error(err);
          });
        });
    } else {
        console.log("no file path");
    }
  }

  /**
   * Not entirely sure what this does yet.
   * @param {object} markers 
   */
  function handleEditorValidation(markers) {
    // model markers
    if(language in languagesWithValidation)
      markers.forEach(marker => console.log("onValidate:", marker.message));
  };
 
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      setOriginalCode(pCode => e.target.result);
    }
    reader.readAsText(file);
  };

  function handleDiffCodeChange(e) {
    setCode(pCode => e);
  }

  function handleCodeChange(e) {
    setCode(pCode => e);
  };

  function handleAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOptions(pOpt => {
      return {
        ...pOpt,
        open: false
      }
    })
  };
  
  editorFns.saveCodeFn = saveCode;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <React.Fragment>
        <CssBaseline />
        <Menubar 
          addEditor={addEditor} 
          setAddEditor={setAddEditor}
          allLanguages={allLanguages}
          language={language}
          setLanguage={setLanguage}
          code={code}
          editorFns={editorFns}
          setDrawerState={setDrawerState}
        />
        <Sidebar 
          handleCodeFileChange={handleCodeFileChange} 
          treeData={treeData}
          setTreeData={setTreeData}
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
          setCode={setCode}
          setOriginalCode={setOriginalCode}
          setEditorFns={setEditorFns}
          util={util}
          setUtil={setUtil}
          setDrawerState={setDrawerState}
          drawerState={drawerState}
          setAlertOptions={setAlertOptions}
        />
        <Container maxWidth={false} disableGutters>
          <Stack>
            <Item>
              <Box sx={{ height: "48px" }}>
                &nbsp;
              </Box>
              <Box 
                component="main"
                sx={{ flexGrow: 1 }}
              >
                    {addEditor === "diffEditor"
                    && 
                    <DiffEditor
                      value={
                        [originalCode, code]
                      }
                      width="100%"
                      mode={language}
                      onChange={handleDiffCodeChange}
                      theme="monokai"
                    />}
                    {addEditor === "apiTestor"
                    &&
                    <>
                      <APIPanel apiBody={apiBody} setApiBody={setApiBody}/>
                      <Typography variant="subtitle2" color="#FFFFFF" sx={{ ml: "30px", mb: "4px"}}>
                        Body Data <Chip icon={<DataObject/>} label="JSON" color="secondary" size="small"/>
                      </Typography>
                      <AceEditor
                      mode="json"
                      theme="monokai"
                      value={code}
                      onChange={handleCodeChange}
                      width="100%"
                      editorProps={{ $blockScrolling: true }}
                      setOptions= {{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                      }}
                      />
                    </>
                    }
                    {addEditor === null
                    &&
                    <AceEditor
                      mode={language}
                      theme="monokai"
                      value={code}
                      onChange={handleCodeChange}
                      width="100%"
                      editorProps={{ $blockScrolling: true }}
                      setOptions= {{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                      }}
                    />
                    }
              </Box>
          </Item>
          <Item>
            <ConsoleFeed />
          </Item>
          </Stack>
        </Container>
        </React.Fragment>
      </Box>
      <Snackbar open={alertOptions.open} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
        <Alert onClose={handleAlertClose} severity={alertOptions.severity} sx={{ width: '100%' }}>
          {alertOptions.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
