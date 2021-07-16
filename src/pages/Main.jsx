import React, { useState, useEffect, useContext } from 'react';
import Upload from '../components/Upload';
import Loader from '../components/Loader';
import Success from '../components/Success';
import { UploadState } from '../context/UploadContext';
import './Main.scss';

const Main = () => {
  const { status } = useContext(UploadState);

  const uploadFlow = () => {
    switch (status.flow) {
      case 'loading':
        return <Loader />;
      case 'success':
        return <Success />;
      default:
        return <Upload />;
    }
  };

  return (
    <>
      <main id='main'>
        <article id='main-article'>{uploadFlow()}</article>
      </main>
    </>
  );
};

export default Main;
