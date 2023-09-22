# Base Client

Web Application

## Setup

This project requires node 16.10 or higher.

To install latest Yarn, run:

```bash
corepack enable
yarn set version stable
```

To install dependencies, run:

```bash
yarn
```

Run a specific web environment using:

```bash
yarn web.local
yarn web.dev
yarn web.prod
```

To run the current environment you have selected:

```
yarn web.start
```

## Production

To build the web app for production, run:

```bash
yarn web.build
```

## Running Tests

To run the unit tests, run:

```
yarn test
```

You can also run tests for a specific workspace like this:

```
yarn core.test
yarn web.test
yarn mobile.test
```

