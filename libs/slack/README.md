<p align="center">
  <a href="http://wemaintain.com/" target="blank"><img src="https://my.wemaintain.com/assets/logos/logo-black.svg" width="275" alt="Nest Logo"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="200" alt="Nest Logo" /></a>
</p>
  
  
<h2 align="center">
  @wemaintain/slack
</h2>
<p align="center">
  Slack module for Nest
</p>

# Installation
1. Install the required packages   
```npm install --save @wemaintain/slack @slack/web-api @slack/events-api```
2. Import the SlackModule in your Module, ideally in the root module   
```typescript
@Module({
  imports: [
    SlackModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Configuration
Configuration of the module can be acheived by using the `forRoot` and `forRootAsync` method

### forRoot:
```typescript
@Module({
  imports: [
    SlackModule.forRoot({
      signingSecret: process.env.SLACK_SIGNING_SECRET
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### forRootAsync:
```typescript
@Module({
  imports: [
    ConfigModule,
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (option) => option.slack
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## SlackClient: WebClient API
The SlackClient is a wrapper the [`WebClient` Slack API](https://slack.dev/node-slack-sdk/web-api)
Inject it inside your component like any other Provider:
```typescript
  constructor(
    protected readonly slackService: SlackClient,
  ){}
```

## SlackEvent: Event API
The SlackEventService is a service that listen for the [`Event` Slack API](https://slack.dev/node-slack-sdk/events-api)

If the `signingSecret` is provided to the SlackModule it will look for @SlackEvent decorator in your controllers
And bind them to the webhook listener

```typescript
@Controller()
export class AppController {

  @SlackEvent('message')
  onMessageInChannel(): void {
    // Do thing
  }
}
```