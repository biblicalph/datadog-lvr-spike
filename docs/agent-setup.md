# Agent setup

Before setting up the agent, we'll need to configure a few things

1. Github token setup
    1. Create a Github token with package read scope. See [classic tokens documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
    2. Add the token in your current terminal session or to your shell - `~/.bashrc` or `~/.zshrc` depending on the configured shell
    3. Authorize the token for use with answerbook repo. Run `npm login --registry=https://npm.pkg.github.com/ --scope=@answerbook --auth-type=legacy`
2. Datadog API key
    1. Create a Datadog API key from the Datadog UI
3. Setup a pipeline
    1. Create a new pipeline with a Datadog agent source. Use the Datadog API key to setup a user defined authorization key for the source.

## Option 1: Setting up the agent on a host machine

### Installation

Install command: DD_API_KEY=<api_key> DD_SITE="datadoghq.com" bash -c "$(curl -L https://install.datadoghq.com/scripts/install_mac_os.sh)".
See the [account settings page](https://app.datadoghq.com/account/settings/agent/latest?platform=macos&_gl=1*ules42*_gcl_au*OTM4NDU5NzM3LjE3MzIyMDg3MTA.*_ga*MTAyNTcwNzk2Mi4xNzMyMjA4NzEw*_ga_KN80RDFSQK*MTczNjk1MDM0Ni4zNi4xLjE3MzY5NTAzNTcuMC4wLjI0MzIyMzI0NQ..*_fplc*cXBzWkFMcHlMazA2ZURKTjB4VDVnbXJZMU9UNXlzNkhCN1ZHNm9YZ1U2VjNXYk9yN3N0eG5GMkN3M2RPNDQ3N2NGOGFjZGQzWm54SjFNcFlwU3drWklhZ2g3VVZ5Q3h6Mk8wN1lyUGxoVUNEOFpQSEpyMDVXR2FrMHAyMnRRJTNEJTNE)

### Configuration

#### Option 1 - Via agent env settings

1. Edit the [agent env](../env.agent) 
2. Load the edited file from a terminal: `source env.agent`
3. In the same terminal session, start the agent: `datadog-agent run`

#### Option 2 - Edit the agent yaml config

Open the agent config file (datadog.yaml). On MacOS, it is located in `/opt/datadog-agent/etc/datadog.yaml` or the symlink  `~/.datadog-agent/datadog.yaml`

1. Under basic configuration set the following:
    1. Uncomment `api_key` and set the value to the datadog API key
    2. Uncomment `dd_url` and set the value to the pipeline service URL. Example [dev pipeline URL](https://pipeline.use.dev.logdna.net/v1/<pipeline_id>)
2. Under log collection configuration
    1. Enable logs collection: `logs_enabled: true`
    2. Uncomment `logs_config` and enable the following values under it
        1. Uncomment `logs_config` under log collection configuration.
        2. Uncomment `logs_dd_url` and set the value to <pipeline_id>.v1.<pipeline_domain>:443. Example [pipeline URL](<pipeline_id>.v1.pipeline.use.dev.logdna.net:443)
        3. Set `force_use_http: true`
3. Under trace collection uncomment `apm_config` and enable the following values under it:
    1. Set `enabled: true` to enable collection of APM
    2. Allow other containers to send traces to the agent. Set `apm_non_local_traffic: true`

See [host agent log collection](https://docs.datadoghq.com/agent/logs/?tab=tailfiles#custom-log-collection) for more.

## Option 2: Setup the agent via docker

To start an instance of the agent via docker, run the [start-agent.sh](./start-agent.sh) script as follows:

1. Edit the [agent environment variables](../env.agent)
2. Load the environment variables in a terminal: `source env.agent`
3. Make the script executable: `chmod +x ./start-agent.sh`
4. Run the script: `./start-agent.sh`

See [agent via docker](https://docs.datadoghq.com/containers/docker/log/?tab=fromfile) documentation for more details.

## Option 3: Setup the agent via docker compose

This setup is similar to the setup via `docker run`. Two compose files [compose.yml](./compose.yml) and [compose-with-web.yml](./compose-with-web.yml) are available for use here. The former starts a node application, a redis server and the datadog agent while the latter also spins up a python web application.
The [datadog](./datadog/) directory contains configuration files that are copied to the agent configuration directory when starting up the agent container.

Update [env.compose](../env.compose) values to setup the environment variables required by the datadog container.

## Collecting logs

**Note**: Regardless of the log collection approach used, structured JSON logs from the node application were sent as strings to the pipeline service datadog agent source. This behavior was observed when logging with either Pino or Winston library. See [winston logging example](https://docs.datadoghq.com/logs/log_collection/nodejs/?tab=winston30&_gl=1*51voqi*_gcl_au*OTM4NDU5NzM3LjE3MzIyMDg3MTA.*_ga*MTAyNTcwNzk2Mi4xNzMyMjA4NzEw*_ga_KN80RDFSQK*MTczNjkxNDA5My4zNC4xLjE3MzY5MTU5NzYuMC4wLjIxMDcwMDgzNTQ.*_fplc*ZXpBRno5WlNuaDBKeFhuRWZBT0swbXJLb1A1WWEzNXp0VzNmQzYzRWYySGpJeTM2cTU4emFwS0Fjc3pwWWtpU2pPQUREaUFVNkV3cSUyRlZkampmNmxaM3FuQ0QzeHh6aHhFNkltM2FqWE5qSFNib3hGd21pdzF3M3NvSG5GR3clM0QlM0Q.&_ga=2.119826447.660975071.1736814979-1025707962.1732208710#overview) in the docs.
In the JSON below, the structured log from the app is represented as a string in the message field.

```json
{
  "ddsource": "nodejs",
  "ddtags": "filename:b8040bd21d3f0f28598948562f26a0f62f8d8af3c639a32580a7006d33d0ac5e-json.log,dirname:/var/lib/docker/containers/b8040bd21d3f0f28598948562f26a0f62f8d8af3c639a32580a7006d33d0ac5e,docker_image:datadog-lvr-example-node,image_name:datadog-lvr-example-node,short_image:datadog-lvr-example-node,image_id:sha256:d174d31556108a5afb50d6a118f631311895b9d5ec7505c1a8fa1d310cdd1ef7,container_name:node,container_id:b8040bd21d3f0f28598948562f26a0f62f8d8af3c639a32580a7006d33d0ac5e",
  "hostname": "docker-desktop",
  "message": "{\"level\":\"error\",\"time\":1736822511825,\"name\":\"datadog-lvr\",\"version\":\"1.0.0\",\"module\":\"lib:log-generator\",\"app\":\"app 1\",\"host\":\"bauch.biz\",\"message\":\"Data corruption detected\"}",
  "service": "node-app",
  "status": "error",
  "timestamp": 1736822512561
} 
```

### Option 1: Tailing log files

One suggested approach is to write structured logs to a file and use the agent to tail the file. See [nodejs logs](https://docs.datadoghq.com/logs/log_collection/nodejs/?tab=winston30).
I experimented with this approach using the following steps:

1. Setup the agent on the host. See [host agent setup](#option-1-setting-up-the-agent-on-a-host-machine)
2. Configure the node app to write logs to a file. Change default value of `log-destination`, set to `stderr`, to `file` in the [config file](./app/config.js)
3. Create a `nodejs.d/conf.yaml` file in the agent config directory located at `/opt/datadog-agent/etc/conf.d/` (or via the symlink `~/.datadog-agent/conf.d`) on MacOS. Add the following to the `nodejs.d/conf.yaml` and restart the agent.

    ```yaml
    init_config:

    instances:

    ##Log section
    logs:

    - type: file
        path: "<path_to_this_project>/app/app.log"
        service: node-api
        source: nodejs
        sourcecategory: sourcecode
    ```

4. Set `DATADOG_AGENT_HOST=127.0.0.1` in [local.env](./app/env/local.env)
5. Start the node dev script: `npm run start:dev`

### Option 2: Collecting logs from docker containers

To collect logs directly from the docker containers, run `docker compose -f compose.yml up -d` and tap the agent source in the pipeline UI to see incoming logs.

## Collecting metrics

Datadog uses the statsd protocol to send metrics.
You can use the [tracer library](https://docs.datadoghq.com/metrics/custom_metrics/dogstatsd_metrics_submission/?code-lang=nodejs) or [hot shots](https://github.com/brightcove/hot-shots) to send metrics to the agent.

### Examples

1. Example of a [nodejs microservice](https://github.com/DataDog/trace-examples/blob/master/javascript/node/microservices/docker-compose.yml) application that sends metrics via the `tracer` library
2. The [node app](./app/) is also setup to generate metrics using the `hot shots` library or the `tracer` library
3. The [compose-with-web.yml](./compose-with-web.yml) file setups up a node and python application interacting with redis and emitting metrics to the datadog agent. **Note**: The [redisdb.yaml](./datadog/conf.d/redisdb.yaml) is mounted to the datadog agent's config directory, ensuring it is able to retrieve metrics from the Redis server

## Tags

Datadog tags can be assigned in one of the ways listed [here in the docs](https://docs.datadoghq.com/getting_started/tagging/#assign-tags).
The implication here is that for logs, tags are assigned via the agent configuration.
For metrics, tags can be assigned when the metric is emitted.
