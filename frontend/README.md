# AccessHOU Frontend App

### Run React API locally

**1. Go to the `frontend`**

```cd accesshouapp/needhou/frontend```

**2. Install dependencies**

```npm install```

**3. Configure API URL**

Open the file named `env.development` and modify the environment variable `REACT_APP_API_URL` to the endpoint of your local Django API which should be running in

[http://localhost:8000](http://localhost:8000)

**4. Run the app**

After making sure the API is running, you should be able to run the frontend app by running

```npm start```

**5. Prepare app for deployment**

If you made some changes and you are ready to deploy your changes you have to do two important things.

  - Modify the `.env.production` file and make sure the `REACT_APP_API_URL` is pointing to the production API endpoint.

  - Create a new build by running

    ```npm run build```
