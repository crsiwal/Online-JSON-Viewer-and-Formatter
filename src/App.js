import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";

import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import About from "./About";

const App = () => {
  const [key, setKey] = useState("text");

  const [jsonInput, setJsonInput] = useState(`console.log("JavaScript Object Notation")`);
  const [error, setError] = useState(null);

  const [viewerJsonData, setViewerJsonData] = useState(null);
  const [viewerError, setViewerError] = useState(null);

  const [height, setHeight] = useState(window.innerHeight);

  // Update height on window resize
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleJsonInputChange = (editor, data, value) => {
    setJsonInput(value);
  };

  const handleFormatClick = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const prettyJson = JSON.stringify(parsedJson, null, 3);
      setJsonInput(prettyJson);
      setError(null);
    } catch (err) {
      // setJsonInput(null);
      setError("JSON Error: Invalid JSON variable");
    }
  };

  const handleMinifyClick = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const minifiedJson = JSON.stringify(parsedJson);
      setJsonInput(minifiedJson);
      setError(null);
    } catch (err) {
      setError("JSON Error: Invalid JSON variable");
    }
  };

  const handleClearClick = () => {
    setJsonInput("");
    setError(null);

    setViewerJsonData(null);
    setViewerError(null);
  };

  const handleTabSelect = k => {
    switch (k) {
      case "viewer":
        try {
          setViewerJsonData(JSON.parse(jsonInput));
          setViewerError(null);
        } catch (err) {
          setViewerError("Invalid JSON");
          setViewerJsonData(null);
        }
        break;
      default:
        break;
    }
    setKey(k);
  };

  return (
    <>
      <div className="container-fluid p-0 border-bottom">
        <Tabs activeKey={key} onSelect={k => handleTabSelect(k)} className="">
          <Tab eventKey="viewer" title="Viewer">
            <div className="p-4" style={{ height: `${height - 50}px`, width: "100%", overflowY: "auto" }}>
              {viewerJsonData && <JsonView theme="vscode" displaySize="collapsed" collapsed={1} enableClipboard={true} src={viewerJsonData} />}
            </div>
          </Tab>
          <Tab eventKey="text" title="Text">
            <div className="border-bottom d-flex justify-content-between bg-light">
              <div className="d-flex align-items-center">
                <div className="btn" onClick={handleFormatClick}>
                  Format
                </div>
                <div className="btn" onClick={handleMinifyClick}>
                  Remove white space
                </div>
                <span className="text-secondary"> | </span>
                <div className="btn" onClick={handleClearClick}>
                  Clear
                </div>
              </div>
              <div>
                <a href="#about" className="btn">
                  About
                </a>
              </div>
            </div>
            <div style={{ height: `${height - 150}px`, width: "100%" }}>
              <CodeMirror
                onBeforeChange={handleJsonInputChange}
                value={jsonInput}
                className="codeMirrorRapper"
                options={{
                  mode: "javascript",
                  theme: "default",
                  lineNumbers: true,
                  lineWrapping: true,
                  lint: true,
                  showCursorWhenSelecting: true,
                  autofocus: true,
                  autocapitalize: false,
                  autocorrect: false,
                  spellcheck: false,
                  extraKeys: { "Ctrl-Space": "autocomplete" },
                }}
              />
            </div>
            {error && (
              <div className="container">
                <div className="row">
                  <div className="col-12 text-danger py-1">{error}</div>
                </div>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
      <About />
      <footer className="py-3 border-top ps-3 bg-light">
        <span className="text-muted">© 2024 Company, Inc</span>
      </footer>
    </>
  );
};

export default App;
