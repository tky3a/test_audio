// /**
//  * Sample React Native Audio Toolkit App
//  * https://github.com/react-native-community/react-native-audio-toolkit
//  *
//  * @format
//  * @flow
//  */

// import React, { Component, useState } from 'react';
// import { Button, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Switch, Text, View, Alert } from 'react-native';
// import Slider from '@react-native-community/slider';
// import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';

// const filename = 'test.mp4';

// export default class App extends Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//       playPauseButton: 'Preparing...',
//       recordButton: 'Preparing...',

//       stopButtonDisabled: true,
//       playButtonDisabled: true,
//       recordButtonDisabled: true,

//       loopButtonStatus: false,
//       progress: 0,

//       error: null
//     };
//   }

//   componentWillMount() {
//     console.log("これ実行してるの？1")
//     this.player = null;
//     this.recorder = null;
//     this.lastSeek = 0;

//     this._reloadPlayer();
//     this._reloadRecorder();

//     this._progressInterval = setInterval(() => {
//       if (this.player && this._shouldUpdateProgressBar()) {
//         let currentProgress = Math.max(0, this.player.currentTime) / this.player.duration;
//         if (isNaN(currentProgress)) {
//           currentProgress = 0;
//         }
//         this.setState({ progress: currentProgress });
//       }
//     }, 100);
//   }

//   componentWillUnmount() {
//     console.log("これ実行してるの？2")
//     clearInterval(this._progressInterval);
//   }

//   _shouldUpdateProgressBar() {
//     // console.log("これ実行してるの？3")
//     // Debounce progress bar update by 200 ms
//     return Date.now() - this.lastSeek > 200;
//   }

//   //
//   _updateState(err) {
//     console.log("これ実行してるの？4")
//     this.setState({
//       playPauseButton: this.player && this.player.isPlaying ? 'Pause' : 'Play',
//       recordButton: this.recorder && this.recorder.isRecording ? 'Stop' : 'Record',

//       stopButtonDisabled: !this.player || !this.player.canStop,
//       playButtonDisabled: !this.player || !this.player.canPlay || this.recorder.isRecording,
//       recordButtonDisabled: !this.recorder || (this.player && !this.player.isStopped),
//     });
//   }

//   _playPause() {
//     console.log("これ実行してるの？5")
//     this.player.playPause((err, paused) => {
//       if (err) {
//         this.setState({
//           error: err.message
//         });
//       }
//       this._updateState();
//     });
//   }

//   _stop() {
//     console.log("これ実行してるの？6")
//     this.player.stop(() => {
//       this._updateState();
//     });
//   }

//   _seek(percentage) {
//     console.log("これ実行してるの？7")
//     if (!this.player) {
//       return;
//     }

//     this.lastSeek = Date.now();

//     let position = percentage * this.player.duration;

//     this.player.seek(position, () => {
//       this._updateState();
//     });
//   }

//   _reloadPlayer() {
//     console.log("これ実行してるの？8")
//     if (this.player) {
//       this.player.destroy();
//     }

//     this.player = new Player(filename, {
//       autoDestroy: false
//     }).prepare((err) => {
//       if (err) {
//         console.log('error at _reloadPlayer():');
//         console.log(err);
//       } else {
//         this.player.looping = this.state.loopButtonStatus;
//       }

//       this._updateState();
//     });

//     this._updateState();

//     this.player.on('ended', () => {
//       this._updateState();
//     });
//     this.player.on('pause', () => {
//       this._updateState();
//     });
//   }

//   _reloadRecorder() {
//     console.log("これの実行？")
//     if (this.recorder) {
//       this.recorder.destroy();
//     }

//     this.recorder = new Recorder(filename, {
//       bitrate: 256000,
//       channels: 2,
//       sampleRate: 44100,
//       quality: 'max'
//     });

//     this._updateState();
//   }

//   _toggleRecord() {
//     console.log("録音実行r")
    
//     if (this.player) {
//       this.player.destroy();
//     }

//     let recordAudioRequest;
//     if (Platform.OS == 'android') {
//       recordAudioRequest = this._requestRecordAudioPermission();
//     } else {
//       recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
//     }

//     recordAudioRequest.then((hasPermission) => {
//       if (!hasPermission) {
//         this.setState({
//           error: 'Record Audio Permission was denied'
//         });
//         return;
//       }

//       console.log("recorder",this.recorder)

//       this.recorder.toggleRecord((err, stopped) => {
//         if (err) {
//           this.setState({
//             error: err.message
//           });
//         }
//         if (stopped) {
//           this._reloadPlayer();
//           this._reloadRecorder();
//         }

//         this._updateState();
//       });
//     });
//   }

//   async _requestRecordAudioPermission() {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: 'Microphone Permission',
//           message: 'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (err) {
//       console.error(err);
//       return false;
//     }
//   }

//   _toggleLooping(value) {
//     this.setState({
//       loopButtonStatus: value
//     });
//     if (this.player) {
//       this.player.looping = value;
//     }
//   }

//   render() {
//     return (
//       <SafeAreaView>
//         <View>
//           <Text style={styles.title}>
//             Playback
//           </Text>
//         </View>
//         <View >
//           <Button title={this.state.playPauseButton} disabled={this.state.playButtonDisabled} onPress={() => this._playPause()} />
//           <Button title={'Stop'} disabled={this.state.stopButtonDisabled} onPress={() => this._stop()} />
//         </View>
//         <View style={styles.settingsContainer}>
//           <Switch
//             onValueChange={(value) => this._toggleLooping(value)}
//             value={this.state.loopButtonStatus} />
//           <Text>Toggle Looping</Text>
//         </View>
//         <View style={styles.slider}>
//           <Slider step={0.0001} disabled={this.state.playButtonDisabled} onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress} />
//         </View>
//         <View>
//           <Text style={styles.title}>
//             Recording
//           </Text>
//         </View>
//         <View>
//           <Button title={this.state.recordButton} disabled={this.state.recordButtonDisabled} onPress={() => this._toggleRecord()} />
//         </View>
//         <View>
//           <Text style={styles.errorMessage}>{this.state.error}</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   slider: {
//     height: 10,
//     margin: 10,
//     marginBottom: 50,
//   },
//   settingsContainer: {
//     alignItems: 'center',
//   },
//   container: {
//     borderRadius: 4,
//     borderWidth: 0.5,
//     borderColor: '#d6d7da',
//   },
//   title: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 20,
//   },
//   errorMessage: {
//     fontSize: 15,
//     textAlign: 'center',
//     padding: 10,
//     color: 'red'
//   }
// });

/* -------------------------------------------------------- */ 

import React, { Component, useState, useEffect } from 'react';
import { Button, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';
import ModalScreen from './components/modal'

const filename = 'test.mp4';

let player;
let recorder = new Recorder(filename, {
  bitrate: 256000,
  channels: 2,
  sampleRate: 44100,
  quality: 'max'
});
let lastSeek;
let progressInterval;
export default function App() {
  const [playPauseButton, setPlayPauseButton] = useState('Preparing...')
  const [recordButton, setRecordButton] = useState('Preparing...')

  const [stopButtonDisabled, setStopButtonDisabled] = useState(true)
  const [playButtonDisabled, setPlayButtonDisabled] = useState(true)
  // いったん保留
  const [recordButtonDisabled, setRecordButtonDisabled] = useState(true)
  
  const [loopButtonStatus, setLoopButtonStatus] = useState(false)
  const [progress, setProgress] = useState(0)

  const [error, setError] = useState(null)
    //  描画時に実行？
  const componentWillMount = () => {
    player = null;
    recorder = null;
    lastSeek = 0;

    reloadPlayer();
    reloadRecorder();
    progressInterval = setInterval(() => {
      if (player && _shouldUpdateProgressBar()) {
        let currentProgress = Math.max(0, player.currentTime) / player.duration;
        if (isNaN(currentProgress)) {
          currentProgress = 0;
        }
        this.setState({ progress: currentProgress });
      }
    }, 100);
  }

  const componentWillUnmount = () => {
    clearInterval(progressInterval);
  }

  const _shouldUpdateProgressBar = () => {
    // Debounce progress bar update by 200 ms
    return Date.now() - lastSeek > 200;
  }

  // state更新
  const _updateState = (err) => {
    const playPauseButtonParams = player && player.isPlaying ? 'Pause' : 'Play'
    console.log("playPauseButtonParams", playPauseButtonParams)
    setPlayPauseButton(playPauseButtonParams)
    console.log("playPauseButton", playPauseButton)

    // レコーディング中にstopになる
    const recordButtonParams = recorder && recorder.isRecording ? 'Stop' : 'Record'
    console.log("recordButtonParams", recordButtonParams)
    setRecordButton(recordButtonParams)
    console.log(recordButton)

    // true false
    const stopButtonDisabledParams = !player || !player.canStop
    setStopButtonDisabled(stopButtonDisabledParams)

    // true false
    const playButtonDisabledParams = !player || !player.canPlay || recorder.isRecording
    setPlayButtonDisabled(playButtonDisabledParams)

    // true false
    const recordButtonDisabledParams = recorder || (player && !player.isStopped)
    setRecordButtonDisabled(recordButtonDisabledParams)
  }

  const _playPause = () => {
    player.playPause((err, paused) => {
      if (err) {
        setError(err.message)
      }
      _updateState();
    });
  }

  const _stop = () => {
    player.stop(() => {
      _updateState();
    });
  }


  const _seek = (percentage) => {
    if (!player) {
      return;
    }

    lastSeek = Date.now();

    let position = percentage * player.duration;

    player.seek(position, () => {
      _updateState();
    });
  }

  const _reloadPlayer = () => {
    if (player) {
      player.destroy();
    }

    this.player = new Player(filename, {
      autoDestroy: false
    }).prepare((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        player.looping = loopButtonStatus;
      }

      _updateState();
    });

    _updateState();

    player.on('ended', () => {
      _updateState();
    });
    player.on('pause', () => {
      _updateState();
    });
  }

  // レコーディング
  const _reloadRecorder = () => {
    if (recorder) {
      recorder.destroy();
    }

    recorder = new Recorder(filename, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: 'max'
    });

    _updateState();
  }
  
  // rec 押下
  const toggleRecord = () => {
    console.log("!!!!!")
    if (player) {
      player.destroy();
    }

    let recordAudioRequest;
    if (Platform.OS == 'android') {
      recordAudioRequest = _requestRecordAudioPermission();
    } else {
      recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
    }

    console.log("recordAudioRequest",recordAudioRequest)

    recordAudioRequest.then((hasPermission) => {
      console.log("hasPermission", hasPermission)
      console.log("----------------ここでエラー-------------------")
      if (!hasPermission) {
        setError('Record Audio Permission was denied')
        return;
      }

      console.log("recorderまでうまくいってそう", recorder)


      recorder.toggleRecord((err, stopped) => {
        if (err) {
          setError(err.message)
        }
        if (stopped) {
          _reloadPlayer();
          _reloadRecorder();
        }

        console.log("?????")

        _updateState();
      });
    });
  }

  const _requestRecordAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  const _toggleLooping = (value) => {
    setLoopButtonStatus(value)
    if (player) {
      player.looping = value;
    }
  }

  return (
    <SafeAreaView>
        <View>
          <Text style={styles.title}>
            Playback
          </Text>
        </View>
        <View >
          <Button title={playPauseButton} disabled={playButtonDisabled} onPress={() => _playPause()} />
          <Button title={'Stop'} disabled={stopButtonDisabled} onPress={() => _stop()} />
        </View>
        <View style={styles.settingsContainer}>
          <Switch
            onValueChange={(value) => _toggleLooping(value)}
            value={loopButtonStatus} />
          <Text>Toggle Looping</Text>
        </View>
        <View style={styles.slider}>
          <Slider step={0.0001} disabled={playButtonDisabled} onValueChange={(percentage) => _seek(percentage)} value={progress} />
        </View>
      <View>
        <Button title={recordButton} disabled={false} onPress={toggleRecord} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 50,
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red'
  }
});