import "./App.css";
import React from 'react';
import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco, loader, DiffEditor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import Menubar from "./components/Menubar";
import Sidebar from "./components/Sidebar";
import { Box, Toolbar, CssBaseline, Container } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SharepointUtil, RavencodeFolderData } from './util/SharepointUtil';

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

function App() {
  // State
  const [siteUrl, setSiteUrl] = useState(txtUrl);
  const [code, setCode] = useState("");
  const [diffEditor, setDiffEditor] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [originalCode, setOriginalCode] = useState("");
  const [isDarkMode, setDarkMode] = useState(true);
  const [treeData, setTreeData] = useState([]);

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
    // TODO: Add in Ctrl+S Save binding to save either local or Sharepoint.
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <React.Fragment>
        <CssBaseline />
        <Menubar 
          diffEditor={diffEditor} 
          setDiffEditor={setDiffEditor}
          allLanguages={allLanguages}
          language={language}
          setLanguage={setLanguage}
        />
        <Sidebar 
          handleCodeFileChange={handleCodeFileChange} 
          treeData={treeData}
          setTreeData={setTreeData}
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
        />
        <Container maxWidth={false} disableGutters>
          <Box 
            component="main"
            sx={{ flexGrow: 1, pt: 6
          }}
          >
                {diffEditor 
                ? 
                <DiffEditor
                  height="90vh"
                  modified={code}
                  original={originalCode}
                  language={language}
                  theme="vs-dark"
                />
                : 
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
                  options={{"bracketPairColorization.enabled": true}}
                />
                }
          </Box>
        </Container>
        </React.Fragment>
      </Box>
    </ThemeProvider>
  );
}

export default App;
