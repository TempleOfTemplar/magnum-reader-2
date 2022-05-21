import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import ObservableAudioSourceBlot from "../AudioSelectModal/audioBlot";
Quill.register(ObservableAudioSourceBlot);

const Editor = ({ onChange, onChangeSelection, setRef, name, value }) => {

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  }


  return (
    <div>
    <ReactQuill
      ref={setRef}
      theme="snow"
      value={value}
      modules={modules}
      onChangeSelection={onChangeSelection}
      onChange={(content, event, editor) => {
        onChange({ target: { name, value: content } });
      }}/>
    </div>
  );
};

export default Editor;