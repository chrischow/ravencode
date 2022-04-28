import "./App.css";
import { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

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

function App() {
  // State
  const [baseurl, setBaseurl] = useState(txtUrl);
  const [filename, setFilename] = useState("");
  const [code, setCode] = useState("");

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

  return (
    <div>
      <h1>RavenITE</h1>
      <p>
        <em>RDO's integrated text editor.</em>
      </p>
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
          <Editor
            height="90vh"
            defaultValue="/** CODE
            */"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
