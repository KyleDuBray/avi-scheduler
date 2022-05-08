import React from 'react';

const FilePicker = (props) => {
  const onFileChoose = (e) => {
    const fileList = e.target.files;
    Array.from(fileList).forEach((file) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        props.parseSchedule(reader.result);
      };
      reader.onerror = () => {
        console.error(reader.error);
      };
    });
  };

  return (
    <>
      <button
        className={props.class}
        tabIndex="-2  
      "
      >
        <>
          <input
            multiple
            name="file"
            type="file"
            id="file"
            onChange={onFileChoose}
            className="inputfile"
          ></input>
          <label className="button-content" tabIndex="-1" htmlFor="file">
            Choose File
          </label>
        </>
      </button>
    </>
  );
};

export default FilePicker;
