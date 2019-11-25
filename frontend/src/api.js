import axios from 'axios';

import { API_URL, IMMIGRATION_STATUSES, IDS } from './constants';
import { signOutAction } from 'actions/user';
import configureStore from './store';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.response.use( (response) => {
  // Return a successful response back to the calling service
  return response;
}, (error) => {
  // Return any error which is not due to authentication back to the calling service
  if (error.response.status !== 401) {
    return Promise.reject(error);
  }

  // Logout user if token refresh didn't work or user is disabled
  // TODO: when deploy change to API_URL in prod

  if (error.config.url === "https://qa-needhou.herokuapp.com/api/token/refresh/") {
    const {store, persistor} = configureStore();
    store.dispatch(signOutAction())
    //persistor.purge()

    return new Promise.reject(error);
  }
  
  // if (error.config.url === "http://localhost:8000/api/token/refresh/") {

  //   const {store, persistor} = configureStore();
  //   store.dispatch(signOutAction())
  //   //persistor.purge()

  //   return Promise.reject(error);
  // }

  // grab refresh token
  //const persistedState = JSON.parse(window.localStorage.getItem('persist:root'));
  const rToken = localStorage.getItem('refresh_token');

  // Try request again with new token
  return refreshToken(rToken).then((result) => {
    // New request with new token
    const config = error.config;
    config.headers['Authorization'] = `Bearer ${result.data.access}`;

    return new Promise((resolve, reject) => {
      axios.request(config).then(response => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      })
    });

  })
  .catch((error) => {
    Promise.reject(error);
  });
});

const signIn = (data) => {
  return client.post(
    '/auth/',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ); 
}

const refreshToken = (refreshToken) => {
  return client.post(
    '/token/refresh/',
    {
      "refresh": refreshToken
    }
  );
}

const getUserProfile = (token) => {
  return client.get(
    `/user/profile/`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
  );
}

const updateUserProfile = (token, data) => {
  return client.put(
    '/user/profile/',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const createAgency = (token, data) => {
  let url = '/agency/queue/';
  let headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    url = '/agency/';
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  }

  return client.post(
    url,
    JSON.stringify(data),
    {
      headers: headers
    }
  );
}

const updateAgency = (token, data) => {
  let url = '/agency/queue/';
  let headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    url = '/agency/';
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  }

  return client.put(
    url,
    JSON.stringify(data),
    {
      headers: headers
    }
  );
}

const deleteAgency = (token, data) => {
  let headers = {
    'Content-Type': 'application/json',
  }

  if(token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }

    return client.delete(
      `/agency/${data.agency_id}`,
      {
        headers: headers
      }
    );
  }

  return client.post(
    `/agency/queue/delete`,
    JSON.stringify(data),
    {
      headers: headers
    }
  );
}

const getAgency = (data) => {
  return client.get(
    `/agency/${data.property}/${data.value}/`,
  );
}

const getAgencies = (data) => {
  return client.get(
    `/agencies/${data.property}/${data.value}/${data.page}`,
  );
}

const createProgram = (token, data) => {
  let url = '/program/queue/';
  let headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    url = '/program/';
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  }

  data['acceptedIdsLength'] = IDS.length;
  data['immigrationStatusesLength'] = IMMIGRATION_STATUSES.length;

  return client.post(
    url,
    JSON.stringify(data),
    {
      headers: headers
    }
  );
}

const updateProgram = (token, data) => {
  let url = '/program/queue/';
  let headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    url = '/program/';
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  }

  data['acceptedIdsLength'] = IDS.length;
  data['immigrationStatusesLength'] = IMMIGRATION_STATUSES.length;


  return client.put(
    url,
    JSON.stringify(data),
    {
      headers: headers
    }
  );
}

const deleteProgram = (token, data) => {
  let headers = {
    'Content-Type': 'application/json',
  }

  if(token){
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
    
    return client.delete(
      `/program/${data.program_id}`,
      {
        headers: headers
      }
    );
  }

  return client.post(
    `/program/queue/delete`,
    JSON.stringify(data),
    {
      headers: headers
    }
  ); 
}

const getProgram = (data) => {
  return client.get(
    `/program/${data.property}/${data.value}/`,
  );
}

const getPrograms = (data) => {
  return client.get(
    `/programs/${data.property}/${data.value}/${data.page}`,
  )
}

const search = (params) => {
  return client.get(
    '/search/',
    { 
      params 
    }
  )
}

const getUsers = (token, params) => {
  return client.get(
    '/users/',
    {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
  )
}

const createUser = (token, data) => {
  return client.post(
    '/user/',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const updateUser = (token, data) => {
  return client.put(
    '/user/',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const getAppSettings = (token) => {
  return client.get(
    '/app/settings/',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const updateEmergencyMode = (token, data) => {
  return client.post(
    '/app/settings/',
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const getQueue = (token, params) => {
  return client.get(
    '/queue/',
    {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const getAgencyQueue = (token, id) => {
  return client.get(
    `/queue/agency/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const approveRejectAgencyQueue = (token, params) => {
  return client.post(
    `/queue/agency/`,
    JSON.stringify(params),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const getProgramQueue = (token, id) => {
  return client.get(
    `/queue/program/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const approveRejectProgramQueue = (token, params) => {
  return client.post(
    `/queue/program/`,
    JSON.stringify(params),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

const getAppEmegencyMode = () => {
  return client.get(
    '/app/emergency/'
  )
}

export {
  signIn,
  refreshToken,
  getUserProfile,
  updateUserProfile,

  createAgency,
  updateAgency,
  deleteAgency,
  getAgency,
  getAgencies,

  createProgram,
  updateProgram,
  deleteProgram,
  getProgram,
  getPrograms,
  
  search,

  getUsers,
  createUser,
  updateUser,

  getAppSettings,
  updateEmergencyMode,

  getQueue,
  getAgencyQueue,
  getProgramQueue,

  approveRejectAgencyQueue,
  approveRejectProgramQueue,

  getAppEmegencyMode,
}
