import React, { useRef, useContext, useState } from 'react';
import { UploadState } from '../context/UploadContext';
import axios from 'axios';
import './Upload.scss';
const Upload = () => {
  const { setStatus, promisePreLoad, contentLoaded } = useContext(UploadState);
  const [dragStyle, setDragStyle] = useState();
  const fileRefDrag = useRef();
  const fileRefClick = useRef();

  const uploadImage = async (image) => {
    try {
       setStatus((prev) => ({
        ...prev,

        flow: 'loading',
      }));
      const data = new FormData();
      data.append('image', image);
      const post = await axios.post('/image/upload', data);
      const imageLink = post.data;
      const imgFix = imageLink.includes('localhost')
        ? 'http://' + imageLink
        : 'https://' + imageLink;
      // pre-load image
      await promisePreLoad(imgFix);
      setStatus((prev) => ({
        ...prev,
        flow: 'success',
        link: imgFix,
      }));
    } catch (error) {
      if(error.response.data.error.msg) {
        console.log(error.response.data.error.msg);
        alert(error.response.data.error.msg);
        return
      }
      console.log(error.response)
    }
  };

  const formHandler = (ref) => {
    let data = ref;
    const image = [...data][0];
    if (!image) return;
    uploadImage(image);
  };

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const dragStyles = {
    opacity: dragStyle ? '30%' : '100%',
    transition: '.3s',
  };

  return (
    <>
      {contentLoaded ? (
        <section
          onDragEnter={(e) => preventDefault(e)}
          onDragOver={(e) => preventDefault(e)}
          onDragLeave={(e) => preventDefault(e)}
          onDrop={(e) => preventDefault(e)}
          draggable='false'
          className='upload'
        >
          <h1 className='upload-title'>Upload your image</h1>
          <p className='upload-label'>File should be Jpeg, Png...</p>
          <div
            onDrop={(e) => {
              formHandler(e.dataTransfer.files);
            }}
            style={dragStyles}
            className='upload-dragzone'
          >
            <img
              draggable='false'
              className='upload-dragzone-img'
              src='/image.svg'
            />
            <figcaption className='upload-dragzone-fig'>
              Drag & Drop your image here
            </figcaption>
          </div>
          <p className='upload-text-1'>Or</p>
          <button
            onClick={() => fileRefClick.current.click()}
            className='upload-button'
          >
            Choose a file
          </button>
          <input
            onChange={(e) => {
              formHandler(e.target.files);
            }}
            ref={fileRefClick}
            id='file'
            type='file'
            name='image'
            style={{ opacity: '0' }}
          />
        </section>
      ) : (
        <img src='/loader.svg' />
      )}
    </>
  );
};

export default Upload;
