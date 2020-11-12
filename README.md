# Scallable & Configurable API in node.js

1. [About](#about)
2. [Installation](#installation)
3. [Usage](#usage)
3. [Testing](#testing)
3. [More](#more)
4. [Contributing](#contributing)
5. [License](#license)

## About
The idea behind this project lies in simplicity. It is the template for a generic API with the implementation of user registration and authorization. It's just a sample of how to write a service, feel free to use this project whatever way you need. 

The project uses some [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) practices, like Value Objects and Application Services. 

The code is written in [TypeScript](https://www.typescriptlang.org). The API bases on the express library, with the service written in [node.js](https://nodejs.org). It uses [MongoDB](https://www.mongodb.com) to store data and [mocha](https://mochajs.org) & [chai](https://www.chaijs.com) for testing purposes.

There is an error handling middleware implemented, so you don't have to worry about returning errors from the API. Just throw one and see the result!

Authentication is made with the use of [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library. 

## Installation

Use the package manager [yarn](https://yarnpkg.com) to install dependencies.

```bash
yarn
```

## Usage
You can run it either using the `docker-compose up` command:

```basah
docker-compose up
```
And open the url: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

Or you can open the user-service directory, rename `.env.example` file to `.env` and run one of the following commands:

```bash
yarn start
yarn dev
yarn debug
yarn prod
```
The advantage of the docker-compose is that it sets up the MongoDB database so you don't have to worry about it. And the more services you have, the harder it will be to run them 'by hand'.

To see the API documentation please open [http://localhost:8080/api/v1/docs/](http://localhost:8080/api/v1/docs/)

## Testing
If you run the API using `docker-compose up` command all the tests are being executed.

But if you need to just run the tests, you can either use docker command:

```basah
docker-compose up --build --abort-on-container-exit
```
Or go directly to the service you want to test and run 
```basah
yarn test
```

### Single service structure
```
/src
.../api
.../application
.../common
.../db
.../events
.../exceptions
.../middlewares
.../models
/tests
...
```

### More
If you want to know more about the structure and usage of this template, please feel free to visit [https://medium.com/@mkocik/41c65f84d9c1](https://medium.com/@mkocik/41c65f84d9c1) and check the article out!

## Contributing
If you like the project enough to collaborate and you see some improvements to be made, please create a Pull Request.

## License
[MIT](https://choosealicense.com/licenses/mit/)
