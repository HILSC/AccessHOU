# AccessHOU Backend App

### Run Django API locally

**1. Create a folder locally**

```mkdir accesshouapp```

```cd accesshouapp```

**2. Create a virtual env for python3.**

```python3 -m venv [env-name]```

```source [env-name]/bin/activate```

  - To deactivate the environment just type

    ```deactivate ```

**3. Copy project folder into your new `accesshouapp` folder.**

**4. Install dependencies**

While you have the environment active, go to the app main folder

```cd needhou```

and run

```pip install -r requirements.txt```

This will install all required dependencies to run the Django app in the environment created.

**5. Local configurations**

The Djanog app needs to important configurations in order to be able to start.

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

**6. Run the app**

When the configuration is ready, you should be able to run the app by going to.

```cd accesshouapp/needhou```

and run 

```python manage.py runserver 0:8000```

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
