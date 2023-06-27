export class SetDiscordSettingsBodyDto {
  id: number;
  botId: number;
  discChannelId: string;
  webHookUrl: string;
  slGroupUuid: string;
}
