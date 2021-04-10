import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Row, Col, Button, Toast } from "react-bootstrap";
import "./styles.css";
import Editor from "@monaco-editor/react";
import ControlledEditor from "@monaco-editor/react";
import yaml from "yaml";
import toJsonSchema from "to-json-schema";
/* import {
  quicktype,
  InputData,
  JSONSchemaInput,
  KotlinTargetLanguage
} from "quicktype-core"; */

const EDITOR_HEIGHT = "80vh";
const TOAST_DELAY_MS = 2000;

const IoSandbox = () => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [outputJson, setOutputJson] = useState("{}");
  const [outputSchema, setOutputSchema] = useState('{\n\t"type": "string"\n}');
  const [outputCode, setOutputCode] = useState("// input YAML and process");
  const valueGetter = useRef();
  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [lastProcessingFinished, setLastProcessingFinished] = useState(
    new Date()
  );

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  function handleShowValue() {
    alert(valueGetter.current());
  }

  process = async () => {
    try {
      let inputYaml = valueGetter.current();
      let inputObj = yaml.parse(inputYaml);
      let outputJson = JSON.stringify(inputObj, null, "\t");
      let outputJsonSchema = toJsonSchema(inputObj);
      let outputJsonSchemaStr = JSON.stringify(outputJsonSchema, null, "\t");
      /*       const inputData = new InputData();
      const source = { name: "Player", schema: outputJsonSchemaStr };
      await inputData.addSource(
        "schema",
        source,
        () => new JSONSchemaInput(undefined)
      );
      const lang = new KotlinTargetLanguage("Kotlin", ["kotlin"], "kt"); */
      let outputCode = "";
      // outputCode = quicktype({ lang, inputData });
      setLastProcessingFinished(new Date());
      setToastText("Successfully processed.");
      setShowToast(true);
      setOutputJson(outputJson);
      setOutputSchema(outputJsonSchemaStr);
      setOutputCode(outputCode);
    } catch (error) {
      console.log(error);
      setLastProcessingFinished(new Date());
      setToastText("Failed to process.");
      setShowToast(true);
      setOutputJson("{}");
      setOutputSchema("{}");
      setOutputCode("// failed to process");
    }
  };

  return (
    <Col>
      <Row>
        <h1>YAML to JSON Schema</h1>
      </Row>
      <Row>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={TOAST_DELAY_MS}
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto">toJsonSchema</strong>
            <small>{lastProcessingFinished.toLocaleTimeString()}</small>
          </Toast.Header>
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </Row>
      <Row>
        <Col>
          <Row>Input (YAML)</Row>
          <Row>
            <Editor
              height={EDITOR_HEIGHT}
              language="yaml"
              theme="dark"
              editorDidMount={handleEditorDidMount}
            />
          </Row>
        </Col>
        <Col>
          <Row>Output (JSON)</Row>
          <Row>
            <ControlledEditor
              value={outputJson}
              height={EDITOR_HEIGHT}
              language="json"
              theme="dark"
            />
          </Row>
        </Col>
        <Col>
          <Row>Output (JSON Schema)</Row>
          <Row>
            <ControlledEditor
              value={outputSchema}
              height={EDITOR_HEIGHT}
              language="json"
              theme="dark"
            />
          </Row>
        </Col>
        <Col>
          <Row>Output (Kotlin)</Row>
          <Row>
            <ControlledEditor
              value={outputCode}
              height={EDITOR_HEIGHT}
              language="kotlin"
              theme="dark"
            />
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Button onClick={() => process()}>Process</Button>
      </Row>
    </Col>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<IoSandbox />, rootElement);
