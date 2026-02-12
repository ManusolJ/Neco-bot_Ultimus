import { Client } from "discord.js";

export default interface Event {
  default(client: Client): Promise<void>;

  execute(client: Client): Promise<void>;
}
