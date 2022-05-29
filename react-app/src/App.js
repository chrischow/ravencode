import "./App.css";
import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco, loader, DiffEditor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import 'bootstrap/dist/css/bootstrap.min.css';
import Menubar from "./components/Menubar";
import { Container, Row, Col, Form } from "react-bootstrap";

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
  const [originalCode, setOriginalCode] = useState("");

  const editorRef = useRef(null);

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

  function handleEditorDidMount(editor, mnc) {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('editor','editor.action.formatDocument');
    })
  };

  function handleEditorValidation(markers) {
    // model markers
    // TODO: to check for intellisense support.
    if(language in languagesWithValidation)
      markers.forEach(marker => console.log("onValidate:", marker.message));
  };
 
  function handleFileChange(e) {
    console.log(e);
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
    <div>
      <Menubar 
        diffEditor={diffEditor} 
        setDiffEditor={setDiffEditor}
        allLanguages={allLanguages}
        language={language}
        setLanguage={setLanguage}
        />
      <Container fluid>
        <Row>
          <Col>
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

            {diffEditor && 
            <Form>
              <Form.Group>
                <Form.Label>Diff Original File</Form.Label>
                <Form.Control 
                  onChange={handleFileChange}
                  type="file" 
                  size="sm"
                  accept=".txt"/>
              </Form.Group>
            </Form>}
          </Col>
          <Col xs={10}>
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
              defaultLanguage="javascript"
              language={language}
              theme="vs-dark"
              onValidate={handleEditorValidation}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
            />
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
