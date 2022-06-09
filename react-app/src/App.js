import "./App.css";
import React from 'react';
import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco, loader, DiffEditor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
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

window.MonacoEnvironment = {
  getWorker(moduleId, label){
    switch (label) {
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(URL.createObjectURL(new Blob(
          [loadBlob('css.worker')],
          {
            type: "text/javascript"
          }
          )));
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(URL.createObjectURL(new Blob(
          [loadBlob('html.worker')],
          {
            type: "text/javascript"
          }
          )));
      case 'json':
        return new Worker(URL.createObjectURL(new Blob(
          [loadBlob('json.worker')],
          {
            type: "text/javascript"
          }
          )));
      case 'javascript':
      case 'typescript':
        {
          return new Worker(URL.createObjectURL(new Blob(
            [loadBlob('ts.worker')],
          {
            type: "text/javascript"
          }
          )));
        }
      default:
        return new Worker(URL.createObjectURL(new Blob(
          [loadBlob('editor.worker')],
          {
            type: "text/javascript"
          }
          )));
    }
  }
}

loader.config({ monaco });

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
  "typescript",
  "json",
  "css",
  "less",
  "scss"
]

const allLanguages = [
  ...languagesWithValidation,
  "vb",
  "xml",
  "yaml",
  "python",
  "sql",
  "powerquery",
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
  const [editorFns, setEditorFns] = useState({
    saveFilePath: null
  });
  const [alertOptions, setAlertOptions] = useState({
    open: false,
    message: "",
    severity: "info"
  })

  const editorRef = useRef(null);
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
  
  function handleEditorWillMount(mnc) {
    // alert(JSON.stringify(window.MonacoEnvironment));
    // alert(new URL("rsaf/rdo.js",import.meta.url));
  }

  /**
   * To get the reference to the editor DOM object and add in key bindings
   * @param {object} editor 
   * @param {object} mnc 
   */
  function handleEditorDidMount(editor, mnc) {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('editor','editor.action.formatDocument');
    });
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyS, () => {
      // Ctrl+S doesn't work. Neither does Ctrl+Shift+S.
      if(editorFns.saveFilePath){
        setAlertOptions(pOpt => {
          return {
            open: true,
            message: `Saving to ${editorFns.saveFilePath}`,
            severity: "info"
          }
        });
        util.updateTextFile(editorFns.saveFilePath, code)
          .then((request) => {
            console.log(request.statusText);
            setAlertOptions(pOpt => {
              return {
                open: true,
                message: `Saved to ${editorFns.saveFilePath}!`,
                severity: "success"
              }
            });
          })
      }
    });
  };

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
        />
        <Container maxWidth={false} disableGutters>
          <Stack>
            <Item>
              <Box 
                component="main"
                sx={{ flexGrow: 1, pt: 6 }}
              >
                    {addEditor === "diffEditor"
                    && 
                    <DiffEditor
                      height="90vh"
                      modified={code}
                      original={originalCode}
                      language={language}
                      theme="vs-dark"
                    />}
                    {addEditor === "apiTestor"
                    &&
                    <>
                      <APIPanel apiBody={apiBody} setApiBody={setApiBody}/>
                      <Typography variant="subtitle2" color="#FFFFFF" sx={{ ml: "30px", mb: "4px"}}>
                        Body Data <Chip icon={<DataObject/>} label="JSON" color="secondary" size="small"/>
                      </Typography>
                      <Editor
                        height="40vh"
                        language="json"
                        theme="vs-dark"
                        onValidate={handleEditorValidation}
                        value={code}
                        onChange={handleCodeChange}
                        onMount={handleEditorDidMount}
                        beforeMount={handleEditorWillMount}
                        // Why {bracketPairColorization: {enabled: true}} doesn't work is weird.
                        options={{ "bracketPairColorization.enabled": true }}
                      />
                    </>
                    }
                    {addEditor === null
                    &&
                    <Editor
                      height="90vh"
                      defaultValue="/** CODE
                      */"
                      language={language}
                      theme="vs-dark"
                      onValidate={handleEditorValidation}
                      value={code}
                      onChange={handleCodeChange}
                      onMount={handleEditorDidMount}
                      beforeMount={handleEditorWillMount}
                      // Why {bracketPairColorization: {enabled: true}} doesn't work is weird.
                      options={{ "bracketPairColorization.enabled": true }}
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
      <Snackbar open={alertOptions.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertOptions.severity} sx={{ width: '100%' }}>
          {alertOptions.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
