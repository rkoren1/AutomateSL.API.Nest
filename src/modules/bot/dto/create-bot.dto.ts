export class CreateBotDto {
  loginFirstName: string;
  loginLastName: string;
  loginPassword: string;
  userId: number;
  loginSpawnLocation: string;
  loginRegion?: string;
}
