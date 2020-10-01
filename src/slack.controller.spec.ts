import { Test, TestingModule } from '@nestjs/testing';
import { SlackController } from './slack.controller';
import { AppService } from './app.service'
import { SlackModule } from '@wemaintain/slack'

describe('SlackController', () => {
  let slackController: SlackController
  let app: TestingModule

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [SlackModule],
      controllers: [SlackController],
      providers: [AppService],
    }).compile();

    slackController = app.get<SlackController>(SlackController);
  });

  describe('root', () => {
    it('Should work', async () => {
      await expect(app.init()).resolves
      await expect(slackController.service).toBeDefined()
    });
  });
});
