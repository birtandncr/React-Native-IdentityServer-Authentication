import React, {Component} from 'react';
import {View, Alert, Button} from 'react-native';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from '../services/identityServer/config';

export default class Demo extends Component {
  state = {
    token: '',
    refreshToken: '',
  };

  _storeData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };
  _getApiInfo = async () => {
    const TOKENM = this.state.token;
    let success = 0;
    new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject(new Error('Request timed out'));
      }, 10000);

      fetch('url adress', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + TOKENM,
        },
      })
        .then(function(response) {
          console.log('response status :', response.status);
          clearTimeout(timeout);
          if (response && response.status === 200) {
            console.log('status :', response.status);
            return response.json();
          } else {
            reject(new Error('Response error'));
          }
        })
        .then(parsedRes => {
          // process results
          console.log('dönen:', parsedRes);
          success = parsedRes;
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
    })
      .then(function() {
        // request succeed
      })
      .catch(function(err) {
        console.log(err);
        success = -1;
      })
      .finally(f => {
        if (success === 0) {
          this.showErrorAlert('hata var ');
        } else if (success === -1) {
          Alert.alert('Servis Yanıt Vermiyor. ');
        }
      });
  };

  handleAuthorize = async () => {
    const authState = await authorize(config).catch(e => {
      console.log('err:', e);
    });

    console.log('token :', authState.accessToken);
    this.setState({
      token: authState.accessToken,
    });

    this._storeData('STORE_TOKEN', authState.accessToken);

    this._getApiInfo();
  };

  render() {
    return (
      <View>
        <View style={{marginTop: 30}}>
          <Button
            onPress={() => this.handleAuthorize()}
            title="Authorize IdentityServer"
            color="#AA2536"
          />
        </View>

        <View style={{marginTop: 30}}>
          <Button
            onPress={() => this._getApiInfo()}
            title="Refresh IdentityServer"
            color="#FA8036"
          />
        </View>
      </View>
    );
  }
}
