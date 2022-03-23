/**
 *@description
 *@author cy
 *@date 2022-03-23 14:14
 **/
import React from 'react';
import FabricMark from './FabricMark';
import test from '@static/img/test.jpg';

const FabricMarkUse = () => {
  return (
    <>
      <FabricMark currentFile={{ dataPath: test }} markType="draw" />
    </>
  );
};
export default FabricMarkUse;