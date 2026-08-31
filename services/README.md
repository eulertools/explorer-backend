# Euler Tools Data Gateway

> Exposes end-points to retrieve data.

## About

This project uses [Feathers][1]. An open source web framework for building modern real-time applications.

## Setup

This project requires node `15.0.0` with npm `7.0.2`.

- Run `npm i`
- Copy `.env.example` to `.env` and update variables accordingly.
- Then, run `export $(xargs < .env)`.

The "copy and paste" version would be:

```bash
npm i
cp .env.example .env
# and update variables accordingly.
export $(xargs < .env)
```

## Development

Use `npm run dev` for development environment.

## Testing

Run `npm test` and all of the tests in the `test/` directory will be run.

## Deploy

### data-gateway

Build the container:

`npm run docker:build`

Tag the desired version:

`AWS_ACCOUNT_ID=XXXXXXX npm run docker:tag`

Push the container:

`AWS_ACCOUNT_ID=XXXXXXX npm run docker:push`

Finally, refresh the cluster:

```bash
DATA_GATEWAY_CLUSTER=data-gateway-cluster-dev  \
AWS_PROFILE=dev  \
AWS_REGION=us-east-1  \
npm run cluster:update
```

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```sh
npm install -g @feathersjs/cli          # Install Feathers CLI
feathers generate service               # Generate a new Service
feathers generate hook                  # Generate a new Hook
feathers help                           # Show all commands
```

## Help

For more information on all the things you can checkout the [Feathers JS documentation][2].

[1]: http://feathersjs.com
[2]: http://docs.feathersjs.com
