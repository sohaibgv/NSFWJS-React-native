import React, { Fragment } from 'react';
import {
  Text,
  Image,

} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import * as nsfwjs from 'nsfwjs';

export default class App extends React.Component {
  state = {
    tfReady: false,
    modelReady: false,
    predictions: null,
    image: null,
    testthing: null,
    predictionsReady: false
  };

  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.ready();
    // Signal to the app that tensorflow.js can now be used.
    this.setState({ tfReady: true });
    this.model = await nsfwjs.load();
    this.setState({ modelReady: true });
    const imageAssetPath = Image.resolveAssetSource(require("./assets/test.jpg"));
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
    const rawImageData = await response.arrayBuffer();
    const imageTensor = await this.imageToTensor(rawImageData);
    var result = await this.model.classify(imageTensor);
    this.setState({ predictions: result, predictionsReady: true })


  }

  imageToTensor(rawImageData: ArrayBuffer): tf.Tensor3D {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  }

  render() {
    return (
      //Wilde .map gebruiken maar je snapt de implementatie wel.
      <Fragment>
        <Image source={require('./assets/test.jpg')} />
        {this.state.predictionsReady ? <Text>ClassName: {this.state.predictions[0].className} Predictions: {this.state.predictions[0].probability}</Text> : null}
        {this.state.predictionsReady ? <Text>ClassName: {this.state.predictions[1].className} Predictions: {this.state.predictions[1].probability}</Text> : null}
        {this.state.predictionsReady ? <Text>ClassName: {this.state.predictions[2].className} Predictions: {this.state.predictions[2].probability}</Text> : null}
        {this.state.predictionsReady ? <Text>ClassName: {this.state.predictions[3].className} Predictions: {this.state.predictions[3].probability}</Text> : null}
        {this.state.predictionsReady ? <Text>ClassName: {this.state.predictions[4].className} Predictions: {this.state.predictions[4].probability}</Text> : null}
      </Fragment>
    );
  }
};