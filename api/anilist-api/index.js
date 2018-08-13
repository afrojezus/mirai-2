// Anilist 0.2 API wrapper for Mirai

// Fetch? Fuck that.
import axios from 'axios';

// Point to your configuration file
import { clientID, clientSecret } from './config.json';
import { userQuery } from './userqueries';
import user from "../../store/modules/user";
const client = clientID;
const secret = clientSecret;

// Anilist GraphlQL url
const source = 'https://graphql.anilist.co';

// Headers for request
const headers = {
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
};

// This gets thrown if you don't specify configuration file, or if it has any errors.
const noKey = () => new Error('No keys defined, API error.');

// Async get method for any kind of query.
const get = async (query, reqObj) => {
  const userToken = localStorage.getItem('ALTOKEN');
  try {
    if (!client && !secret) {
      throw noKey;
    }
    const data = await axios.post(
      source,
      {
        query,
        variables: reqObj,
      },
      userToken
        ? {
            headers: {
              Authorization: 'Bearer ' + userToken,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        : null
    );
    return data.data;
  } catch (error) {
    return console.error(error);
  }
};

const getUser = async reqObj => {
  const userToken = localStorage.getItem('ALTOKEN');
  if (!userToken) return null;
  try {
    if (!client && !secret) {
      throw noKey;
    }
    const data = await axios.post(
      source,
      {
        query: userQuery,
      },
      {
        headers: {
          Authorization: userToken ? 'Bearer ' + userToken : null,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log(data);
    return data.data;
  } catch (error) {
    return console.error(error);
  }
};

// Async get method for any kind of query, but with Fetch API instead.
const fGet = async (query, reqObj) => {
  try {
    if (!client && !secret) {
      throw noKey;
    }
    const request = await fetch({
      url: source,
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: reqObj,
      }),
    });
    const { data } = await request.json();
    return data;
  } catch (error) {
    return console.error(error);
  }
};

const auth = async token => {
  localStorage.setItem('ALTOKEN', token);
  return console.info('[mirai] AniList token applied');
};

const fetchUser = async token => {
  if (!token) return null;
  try {
     const data = await axios.post(
       source,
       {
         query: userQuery,
       },
       {
         headers: {
           Authorization: 'Bearer ' + token,
           'Content-Type': 'application/json', Accept: 'application/json',
         }
       });
     console.log(data);
     return data.data;
  } catch (error) {
      return error;
  }
};

export default {
  get,
  fGet,
  auth,
  getUser,
  fetchUser,
};
