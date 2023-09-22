# Base Client

Web Application

## Setup

This project requires Bun. To install bun run:

```bash
curl -fsSL https://bun.sh/install | bash
```

To install dependencies, run:

```bash
bun install
```

Run a specific web environment using:

```bash
bun run web.local
bun run web.dev
bun run web.prod
```

To run the current environment you have selected:

```
bun run web.start
```

## Production

To build the web app for production, run:

```bash
bun run web.build
```

## Running Tests

To run the unit tests, run:

```
bun run test
```

You can also run tests for a specific workspace like this:

```
bun run core.test
bun run web.test
bun run mobile.test
```

