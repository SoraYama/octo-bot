# Octo-Bot

> 'Octo-Bot' means octopus-bot, with one head and several adapters to different platforms

## For bot developers

`octo-bot` is a bot framework which focuses on multi-platform adaption, aims to `write once, run everywhere`.

### Download

1. CLI

> COMING SOON

2. clone this repo

```bash
git clone git@github.com:SoraYama/octo-bot.git OCTO_TMP_DIR
cp -r ./OCTO_TMP_DIR/packages/app ./MY_AWESOME_BOT
rm -rf ./OCTO_TMP_DIR
cd ./MY_AWESOME_BOT
```

### Usage

1. install dependencies

```bash
yarn
# or npm i
```

2. configure your bots

- add `<PLATFORM_NAME>.config.ts` to `src/config` folder

```ts
export default {
  BOT_TOKEN: 'YOUR_BOT_TOKEN',
  // ... other bot configs
};
```

3. run

```bash
yarn dev
```

Then go to your bot app and enter '/echo test HELLO', see what will happen!

### Developing

#### Inner Objects

Some basic objects in framework should be clear before you start using `octo-bot`.

1. `config`

`octo-bot` is a "convention-over-configuration" framework, `module`, `service` and `config` folder should be directly set under `src` folder, framework will load each file and handle them automaticly.

2. `module`

`octo-bot` regards every message handler set as a module to implement functions you want. A module in `octo-bot` is a class which should extends `BaseModule`, and each method in the module is a specific message handler triggered by message sent to the channel or group. `module` should be named like `A.module.ts`, `A` will be recorded as a key stores in the memory.

3. `Trigger`

`octo-bot` use decorators to simplify code. `Trigger` can decorate both `module` and methods in a `module`, describe what kind of incoming message can trigger this module or method.

4. `service`

`service` is an abstract layer which is usually used to encapsulate business logics in complex business circumstances. A wise usage of `service` will keep logics in `module` cleaner and clearer and can be reused in different modules. `service` should be named like `A.module.ts`, `A` will be recorded as a key stores in the memory, and can be called as param in `Service` decorator. `Service` can decorate a property in a `module` class to inject proper `Service` instance.

Here is an example `module` file:

5. `Schedule`

`Schedule` decorator can decorate a module method to handle cron job. The decorator function accepts a [cron expression](https://en.wikipedia.org/wiki/Cron) to trigger method properly.

```ts
// echo.module.ts
@Trigger('/echo')
class EchoModule extends BaseModule {
  @Service('echo')
  private echoService!: EchoService;

  @Trigger({ match: 'test', methods: [TriggerMethod.Prefix], helpText: 'repeat test' })
  public async echo() {
    await this.event.reply({
      content: this.echoService.getRemain(),
    });
  }
}
```

We split a text message by space character, the initial word will be regarded as main module trigger. In upper case, the `Trigger` decorator register a handler triggered by message start with '/echo' to `EchoMoudle`, and the second word is set to be the method trigger text. Simply say, a text message like '/echo test ramain params' will call 'echo' method in `EchoModule`, and framework will inject converted message event (OctoEvent) to `EchoModule` instance, can be visited by `this.event`.

#### Project structure

A possible project stucture may like below:

```
├── package.json
├── node_modules
├── src
│   ├── config
│   │   ├── discord.config.ts
│   │   ├── telegram.config.ts
│   │   └── tomon.config.ts
│   ├── index.ts
│   ├── log
│   │   └── main.log
│   ├── module
│   │   └── echo.module.ts
│   └── service
│       └── echo.service.ts
├── tsconfig.json
└── yarn.lock
```

## For `octo-bot` contributors

### Developing an adapter for a new platform

Three classes and their abstract methods should be implemented in your bot project:

- `OctoBot`

- `OctoGroup`

- `OctoEvent`

Make sure bot developer can import your custom `Bot` class properly.
