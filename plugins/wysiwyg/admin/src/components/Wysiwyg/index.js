import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@buffetjs/core";
import { Label, Description, ErrorMessage } from "@buffetjs/styles";
import Editor from "../QuillEditor";
import MediaLib from "../MediaLib";
import SelectAudioModal from "../AudioSelectModal";

const Wysiwyg = ({ inputDescription, error, label, name, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAudioModal, setIsOpenAudioModal] = useState(false);
  let quillRef = null;
  const [cursorPosition, setCursorPosition] = useState(false);
  const handleChange = (data) => {
    if (data.mime.includes("image")) {
      const imgTag = `<p><img src="${data.url}" caption="${data.caption}" alt="${data.alternativeText}"></img></p>`;
      const newValue = value ? `${value}${imgTag}` : imgTag;

      onChange({ target: { name, value: newValue } });
    }

    // Handle videos and other type of files by adding some code
  };
  const handleAudioModalChange = (data) => {
    // const newValue = value ? `${value}${audioSourceTag}` : audioSourceTag;
    const editor = quillRef.getEditor();
    // var range = editor.getSelection();
    let position = cursorPosition ? cursorPosition.index : 0;
    console.log("AT POSITION", position);
    console.log("data", data);
    // editor.insertText(position, "WTK KEK ASDKALKSDKASKDAJSDNMJNDSNJAKN!");
    editor.insertEmbed(position, "observableAudioSource", {src: data.track, region: data.region}, "user");
    // onChange({ target: { name, value: newValue } });
  };

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleToggleAudioModal = () => setIsOpenAudioModal((prev) => !prev);
  const handleCursorPositionChange = (newPosition) => {
    // console.log("NEW CURSOR POS", newPosition);
    if(newPosition && newPosition.index > 0) {
      setCursorPosition(newPosition);
    }
  };

  const handleSetRef = (newRef) => {
    quillRef = newRef;
  };

  const hasError = Boolean(error);

  return (
    <div
      style={{
        marginBottom: "1.6rem",
        fontSize: "1.3rem",
        fontFamily: "Lato",
      }}
    >
      <div style={{ position: 'absolute', right: '15px', top: '-10px' }}>
        <Button color="primary" onClick={handleToggle}>
          MediaLib
        </Button>
        <Button color="primary" style={{position: "fixed", zIndex: 1}} onClick={handleToggleAudioModal}>
          AudioModal
        </Button>
      </div>
      <Label htmlFor={name} style={{ marginBottom: 10 }} >{label} </Label>

      <Editor name={name} onChange={onChange} setRef={handleSetRef} onChangeSelection={handleCursorPositionChange} value={value} />

      {!hasError && inputDescription && (
        <Description>{inputDescription}</Description>
      )}
      {hasError && <ErrorMessage>{error}</ErrorMessage>}

      <MediaLib
        onToggle={handleToggle}
        isOpen={isOpen}
        onChange={handleChange}
      />
      <SelectAudioModal
        isOpen={isOpenAudioModal}
        allowedTypes={['audio']}
        onChange={handleAudioModalChange}
        onToggle={() => setIsOpenAudioModal(!isOpenAudioModal)}
      />
    </div>
  );
};

export default Wysiwyg;