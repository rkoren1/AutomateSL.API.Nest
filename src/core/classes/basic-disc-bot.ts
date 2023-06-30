import { BotOptionFlags, LoginParameters } from '@caspertech/node-metaverse';
import fetch from 'node-fetch';
import { BotDb } from 'src/modules/bot/entities/bot.entity';
import { DiscordSettings } from 'src/modules/discord-settings/entities/discord-setting.entity';
import { User } from 'src/modules/user/entities/user.entity';
import * as urlMetadata from 'url-metadata';
import { discClient } from '../services/discord-bot.service';
import { BaseBot } from './base-bot';

export class BasicDiscBot extends BaseBot {
  constructor(
    login: LoginParameters,
    options: BotOptionFlags,
    user: User,
    bot: BotDb,
    discParams: DiscordSettings,
  ) {
    super(login, options, user, bot);
    this.relayGroupChatToDisc(discParams.webHookUrl, discParams.slGroupUuid);
    this.relayDiscordChatToSL(discParams.discChannelId, discParams.slGroupUuid);
  }

  private relayDiscordChatToSL(channelId: string, slGroupId: string) {
    discClient.on('messageCreate', (message) => {
      if (message.channelId === channelId && !message.author.bot) {
        this.clientCommands.comms.sendGroupMessage(
          slGroupId,
          '[Discord] ' + message.author.username + ': ' + message.content,
        );
      }
    });
  }
  private relayGroupChatToDisc(discWebhookUrl: string, groupUuid: string) {
    this.clientEvents.onGroupChat.subscribe((groupChat) => {
      if (
        groupChat.message.startsWith('[Discord]') ||
        groupChat.groupID.toString() !== groupUuid
      ) {
        return;
      }
      urlMetadata(
        'https://world.secondlife.com/resident/' + groupChat.from.toString(),
      ).then((metadata: any) => {
        const body = {
          content: groupChat.message,
          username: groupChat.fromName,
          avatar_url:
            'https://picture-service.secondlife.com/' +
            metadata.imageid +
            '/256x192.jpg',
        };
        fetch(discWebhookUrl, {
          method: 'post',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }).then((res) => {});
      });
    });
  }
}
