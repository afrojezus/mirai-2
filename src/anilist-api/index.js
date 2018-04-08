// Anilist 0.2 API wrapper for Mirai

// Fetch? Fuck that.
import axios from 'axios';

// Point to your configuration file
import { clientID, clientSecret } from '../utils/segoku/config.json';
import { userQuery } from './userqueries';

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
const get = async (query, reqObj) =>
{
  const userToken = localStorage.getItem('ALTOKEN');
  try
  {
    if (!client && !secret)
    {
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
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
        : null,
    );
    return data.data;
  }
  catch (error)
  {
    return error;
  }
};

const getUser = async () =>
{
  const userToken = localStorage.getItem('ALTOKEN');
  if (!userToken) return null;
  try
  {
    if (!client && !secret)
    {
      throw noKey;
    }
    const data = await axios.post(
      source,
      {
        query: userQuery,
      },
      {
        headers: {
          Authorization: userToken ? `Bearer ${userToken}` : null,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return data.data;
  }
  catch (error)
  {
    return error;
  }
};

// Async get method for any kind of query, but with Fetch API instead.
const fGet = async (query, reqObj) =>
{
  try
  {
    if (!client && !secret)
    {
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
  }
  catch (error)
  {
    return error;
  }
};

const auth = async (token) =>
{
  localStorage.setItem('ALTOKEN', token);
  return '[mirai] AniList token applied';
};

export default {
  get,
  fGet,
  auth,
  getUser,
};
