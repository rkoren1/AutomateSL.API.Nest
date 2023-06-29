import {
  Bot,
  BotOptionFlags,
  InstantMessageEvent,
  LoginParameters,
  Vector3,
} from '@caspertech/node-metaverse';
import fetch from 'node-fetch';
import { BotLog } from 'src/modules/bot-log/entities/bot-log.entity';
import { BotDb } from 'src/modules/bot/entities/bot.entity';
import { DiscordSettings } from 'src/modules/discord-settings/entities/discord-setting.entity';
import { User } from 'src/modules/user/entities/user.entity';
import * as urlMetadata from 'url-metadata';
import { discClient } from '../services/discord-bot.service';
import { isUuidValid } from '../services/helper.service';

export class BasicDiscBot extends Bot {
  private ownerUUID: string;
  private ownerName: string;
  private botData: BotDb;
  constructor(
    login: LoginParameters,
    options: BotOptionFlags,
    user: User,
    bot: BotDb,
    discParams: DiscordSettings,
  ) {
    super(login, options);
    this.botData = bot;
    this.ownerUUID = user.uuid;
    this.ownerName = this.convertOwnerName(user.avatarName);
    this.acceptOwnerTeleport();
    //on every disconnect write a log in the database and set bot_running to false
    //this.onDiscconectLogToDb(login);
    this.acceptGroupInvites();
    this.subscribeToImCommands();
    //ping bot every 15mins
    /* cron.schedule('15 * * * *', () => {
          this.pingBot(login);
        });  //dont' use doesnt work properly */
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
  private pingBot(login: LoginParameters) {
    BotDb.findOne({ where: { uuid: this.botData.uuid } }).then((resBot) => {
      if (
        this.currentRegion === undefined &&
        (resBot.shouldRun || resBot.running)
      ) {
        BotLog.create({
          name: login.firstName + ' ' + login.lastName,
          botUuid: this.botData.uuid,
          message: 'Tried to reconnect bot automatically',
          event: 'auto-reconnect',
        });
        this.login()
          .then(() => this.connectToSim())
          .then(() => {
            BotDb.update(
              { running: true, shouldRun: false },
              { where: { id: this.botData.id } },
            );
          });
      }
    });
  }
  private onDiscconectLogToDb(login: LoginParameters) {
    this.clientEvents.onDisconnected.subscribe((res) => {
      BotLog.create({
        name: login.firstName + ' ' + login.lastName,
        botUuid: this.botData.uuid,
        message: JSON.stringify(res),
        event: 'disconnect',
      });
      if (res.requested === false) {
        BotDb.update(
          { running: false, shouldRun: true },
          { where: { id: this.botData.id } },
        );
        //after 5min log bot back in, make log and set running true and should_run false
        setTimeout(() => {
          this.login()
            .then(() => this.connectToSim())
            .then(() => {
              BotDb.update(
                { running: true, shouldRun: false },
                { where: { id: this.botData.id } },
              );
              BotLog.create({
                name: login.firstName + ' ' + login.lastName,
                botUuid: this.botData.uuid,
                message: 'Tried to reconnect bot automatically',
                event: 'auto-reconnect',
              });
            });
        }, 300000);
      }
    });
  }

  private acceptOwnerTeleport() {
    this.clientEvents.onLure.subscribe((teleport) => {
      if (teleport.from.toString() === this.ownerUUID) {
        this.clientCommands.teleport.acceptTeleport(teleport);
      }
    });
  }

  private convertOwnerName(name: string) {
    return name.replace(' ', '.').toLocaleLowerCase();
  }

  private subscribeToImCommands() {
    this.clientEvents.onInstantMessage.subscribe(
      (messageEvent: InstantMessageEvent) => {
        if (messageEvent.message === '') return;
        if (
          messageEvent.from.toString() !== this.ownerUUID &&
          messageEvent.owner.toString() !== this.ownerUUID
        ) {
          if (
            messageEvent.source === 1 &&
            messageEvent.fromName !== 'Second Life'
          ) {
            this.clientCommands.comms.sendInstantMessage(
              messageEvent.from,
              "I'm sorry, but the Bot's commands are restricted to certain users with higher permissions. At this time, you do not have those permissions.",
            );
          }
          return;
        }
        const message = messageEvent.message.split('^');
        const messageCommand = message[0];
        const commandParams = message.slice(1);
        //parse commands and execute actions
        switch (messageCommand) {
          case 'send_im': {
            if (commandParams.length !== 2) {
              this.clientCommands.comms.sendInstantMessage(
                messageEvent.from,
                'Invalid Command!',
              );
              break;
            }
            if (!isUuidValid(commandParams[0])) {
              this.clientCommands.comms.sendInstantMessage(
                messageEvent.from,
                'Invalid UUID!',
              );
              break;
            }
            /* this.clientCommands.comms.sendInstantMessage(
                  messageEvent.from,
                  'Command Accepted'
                ); */
            this.clientCommands.comms.sendInstantMessage(
              commandParams[0],
              commandParams[1],
            );
            break;
          }
          case 'say': {
            this.clientCommands.comms.say(commandParams[0]);
            break;
          }
          case 'teleport': {
            this.clientCommands.teleport.teleportTo(
              commandParams[0],
              new Vector3([
                +commandParams[1],
                +commandParams[2],
                +commandParams[3],
              ]),
              Vector3.getZero(),
            );
            break;
          }
          case 'shout': {
            this.clientCommands.comms.shout(commandParams[0]);
            break;
          }
          case 'group_im': {
            this.clientCommands.comms.sendGroupMessage(
              commandParams[0],
              commandParams[1],
            );
            break;
          }
          case 'group_notice': {
            if (commandParams.length !== 3) {
              this.clientCommands.comms.sendInstantMessage(
                messageEvent.from,
                'Invalid Command!',
              );
              break;
            }
            this.clientCommands.group.sendGroupNotice(
              commandParams[0],
              commandParams[1],
              commandParams[2],
            );
            break;
          }
          case 'group_invite': {
            if (commandParams.length !== 3) {
              this.clientCommands.comms.sendInstantMessage(
                messageEvent.from,
                'Invalid Command!',
              );
              break;
            }
            this.clientCommands.group.sendGroupInvite(
              commandParams[0],
              commandParams[1],
              commandParams[2],
            );
            break;
          }
          default: {
            this.clientCommands.comms.sendInstantMessage(
              messageEvent.from,
              'Invalid Command!',
            );
            break;
          }
        }
      },
    );
  }
  private acceptGroupInvites() {
    this.clientEvents.onGroupInvite.subscribe((groupInvite) => {
      if (groupInvite.fromName === this.ownerName)
        this.clientCommands.group.acceptGroupInvite(groupInvite);
    });
  }
}
