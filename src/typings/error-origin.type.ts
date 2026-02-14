import { CommandInteraction, Message, Client } from "discord.js";

import ErrorOriginType from "@enums/error-origin.enum";

type ErrorOrigin =
  | { type: ErrorOriginType.INTERACTION; source: CommandInteraction }
  | { type: ErrorOriginType.MESSAGE; source: Message }
  | { type: ErrorOriginType.BACKGROUND; source: Client };

export default ErrorOrigin;
