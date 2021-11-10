# AccessHOU Backend App

### Run Django API locally

**1. Create a folder locally**

```mkdir accesshouapp```

```cd accesshouapp```

**2. Create a virtual env for python3. **

```python -m venv [env-name]```

or

```python3 -m venv [env-name]```

```source [env-name]/bin/activate```

  - To deactivate the environment just type

    ```deactivate ```

**3. Then copy the project folder into your new `accesshouapp` folder. **

**4. Install dependencies**

While you have the environment active, go to the app main folder

```cd needhou```

and run

```pip install -r requirements.txt```

If using pip3 run

```pip3 install -r requirements.txt```

This will install all required dependencies to run the Django app in the environment created.

**5. Local configurations**

The Djanog app needs a few important configurations in order to be able to start.

Open the `needhou/settings.py` and make sure you modify the SECRET_KEY and DATABASE info. Should look something like this.

<pre><code>SECRET_KEY=mysecretkey</code></pre>

<pre><code>
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'database_name',
        'USER': 'database_user',
        'PASSWORD': 'database_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
</code></pre>

You may also want to comment out these lines disable HTTPS for local environment.

<pre><code>
# HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
</code></pre>

Make sure to add localhost to ALLOWED_CLIENTS otherwise you'll run into CORS issues.

<pre><code>
# ALLOWED CLIENTS
ALLOWED_CLIENTS = (
    'http://accesshou.brightanchor.com',
    'https://accesshou.brightanchor.com',
    'https://dev-accesshou.herokuapp.com',
    'https://prod-accesshou.herokuapp.com',
    'https://accesshou.org',
    'http://accesshou.org',
    'https://www.accesshou.org',
    'http://www.accesshou.org',
    'http://localhost:8000',
    'http://localhost:3000',
)
</pre></code>

**6. Run the app**

When the configuration is ready, you should be able to run the app by going to.

```cd accesshouapp/needhou```

The react app requires the python server to be running to work. After running `npm run build` in the `frontend` directory you may need to run the following command to update the Python apps static files:

```python manage.py collectstatic```

or

```python3 manage.py collectstatic```

then run

```python manage.py runserver 0:8000```

or

```python3 manage.py runserver localhost:8000```

The application should be running here:

[http://localhost:8000](http://localhost:8000)

**7. See the api endpoints**

To see the api endpoints, you should be able to go to

```cd accesshouapp/api/urls.py```

The endpoints should look something like this

```http://localhost:8000/api/auth/```

```http://localhost:8000/api/user/profile/```

**8. Deployment**

To prepare your app to be deploy, you need to make sure of a couple of things.

  1. Make sure the settings is configured to get the SECRET_KEY, DATABASE and other API KEY fron the environment variables instead of hard coded.

  2. If you did frontend changes, make sure to prepare the build in the [frontend](../frontend/README.md)

  3. Run the python manage collectstatic, to update the static files with your latest frontend build

  ```python manage.py collectstatic```

  4. After running this, your code is ready to be deploy. If you are using Heroku to deploy. Make sure you have:

  - Procfile
  - runtime.txt

  5. If you have Heroku CLI configure, you should be able to deploy your changes by running

  ```git push heroku master```
