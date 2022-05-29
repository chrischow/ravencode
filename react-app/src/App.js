import "./App.css";
import { useState, useEffect } from "react";
import Editor, { useMonaco, loader, DiffEditor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import 'bootstrap/dist/css/bootstrap.min.css';
import Menubar from "./components/Menubar";

loader.config({ monaco });

const txtUrl =
  "https://raw.githubusercontent.com/chrischow/project-ace/main/rokr/components/";

const getCode = (url, filename, callback) => {
  // Retrieve text
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
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
]

function App() {
  // State
  const [baseurl, setBaseurl] = useState(txtUrl);
  const [filename, setFilename] = useState("");
  const [code, setCode] = useState("");
  const [diffEditor, setDiffEditor] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const handleUrlChange = (event) => {
    setBaseurl(event.target.value);
    console.log(event.target.value);
  };
  
  const handleFilenameChange = (event) => {
    setFilename(event.target.value);
    console.log(event.target.value);
  };

  const loadCode = () => {
    if (baseurl && filename) {
      getCode(baseurl, filename, setCode);
    }
  };

  function handleEditorValidation(markers) {
    // model markers
    // TODO: to check for intellisense support.
    if(language in languagesWithValidation)
      markers.forEach(marker => console.log("onValidate:", marker.message));
  }
 
  function handleCodeChange(e) {
    setCode(pCode => e);
  }

  return (
    <div>
      <Menubar 
        diffEditor={diffEditor} 
        setDiffEditor={setDiffEditor}
        allLanguages={allLanguages}
        language={language}
        setLanguage={setLanguage}
        />
      <div className="grid-container">
        <div>
          <div>
            <h3>Directory</h3>
            <label htmlFor="baseurl">SharePoint Folder:</label>
            <input
              id="baseurl"
              name="baseurl"
              type="text"
              onChange={handleUrlChange}
              value={baseurl}
            ></input>
            <br />
            <label htmlFor="filename">Filename:</label>
            <input
              id="filename"
              name="filename"
              type="text"
              onChange={handleFilenameChange}
            ></input>
            <button onClick={loadCode}>Load</button>
          </div>

          <div className="control-panel">
            <h3>Control Panel</h3>
            <button>Save</button>
          </div>
        </div>
        <div>
          {diffEditor 
          ? 
          <DiffEditor
            height="90vh"
            modified={code}
            original=""
            language={language}
            theme="vs-dark"

          />
          : 
          <Editor
            height="90vh"
            defaultValue="/** CODE
            */"
            defaultLanguage="javascript"
            language={language}
            theme="vs-dark"
            onValidate={handleEditorValidation}
            value={code}
            onChange={handleCodeChange}
          />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
