import { SEND_RESET_TOKEN, EMAIL_ERROR, CLEAR_ERROR, CLEAR_TOKEN } from './types';
import axios from 'axios';

let emailsUrl = process.env.REACT_APP_API_URL + '/emails';

export const sendResetToken = (email) => dispatch => {
    var data = { email };
    axios.post(`${emailsUrl}/send-reset-token`, data)
      .then(response => {
        dispatch({
          type: SEND_RESET_TOKEN
        })
      })
      .catch(error => {
        console.error(error);
        dispatch({
          type: EMAIL_ERROR,
          error: error.response ? error.response.data : error.message
        })
      });
}

export const clearError = () => dispatch => {
  dispatch({
    type: CLEAR_ERROR
  })
}

export const clearResetTokenSent = () => dispatch => {
  dispatch({
    type: CLEAR_TOKEN
  })
}