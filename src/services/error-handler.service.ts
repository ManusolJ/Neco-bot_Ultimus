import { Client, EmbedBuilder, MessageFlags } from "discord.js";

import AppError from "@errors/app.error";
import ErrorCode from "@enums/error-code.enum";
import ErrorOrigin from "@typings/error-origin.type";
import ErrorSeverity from "@enums/error-severity.enum";
import ErrorOriginType from "@enums/error-origin.enum";

const ALERT_CHANNEL: string = process.env.ALERT_CHANNEL ?? "";

export default class ErrorHandlerService {
  private readonly alertChannel: string;

  constructor() {
    this.alertChannel = ALERT_CHANNEL;
  }

  async handle(error: unknown, origin: ErrorOrigin): Promise<void> {
    const normalizedError: AppError = this.normalizeError(error);

    this.logErrorToConsole(normalizedError);

    const isLowOrMediumSeverity = ErrorSeverity.LOW || ErrorSeverity.MEDIUM;

    if (isLowOrMediumSeverity) {
      await this.notifyUser(normalizedError, origin);
    } else {
      await this.alertDev(normalizedError, origin);
    }
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError({
        cause: error,
        message: error.message,
        code: ErrorCode.UNKNOWN_ERROR,
        severity: ErrorSeverity.MEDIUM,
      });
    } else {
      return new AppError({
        message: String(error),
        code: ErrorCode.UNKNOWN_ERROR,
        severity: ErrorSeverity.MEDIUM,
      });
    }
  }

  private logErrorToConsole(error: AppError): void {
    const entry = {
      timestamp: error.timestamp.toISOString(),
      name: error.name,
      code: error.code,
      severity: error.severity,
      message: error.message,
      ...(error.context ? { context: error.context } : {}),
      ...(error.cause ? { cause: (error.cause as Error).message } : {}),
    };

    switch (error.severity) {
      case ErrorSeverity.HIGH:
        console.error("[ERROR]", JSON.stringify(entry, null, 2));
        break;
      case ErrorSeverity.MEDIUM:
        console.warn("[WARN]", JSON.stringify(entry, null, 2));
        break;
      case ErrorSeverity.LOW:
        console.info("[INFO]", JSON.stringify(entry));
        break;
    }
  }

  private async notifyUser(
    error: AppError,
    origin: ErrorOrigin,
  ): Promise<void> {
    const embed = this.buildUserEmbed(error);

    try {
      switch (origin.type) {
        case ErrorOriginType.INTERACTION: {
          const interaction = origin.source;

          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              embeds: [embed],
              flags: MessageFlags.Ephemeral,
            });
          } else {
            await interaction.reply({
              embeds: [embed],
              flags: MessageFlags.Ephemeral,
            });
          }
          break;
        }
        case ErrorOriginType.MESSAGE: {
          const message = origin.source;

          await message.reply({ embeds: [embed] });
          break;
        }
      }
    } catch (replyError) {
      console.error(
        "[ERROR] Failed to send error notification to user:",
        replyError,
      );
    }
  }

  private async alertDev(error: AppError, origin: ErrorOrigin): Promise<void> {
    const missingChannelMsg =
      "[WARN] Alert channel not configured. Skipping alert.";
    const unableToFetchClientMsg =
      "[WARN] Unable to retrieve client. Skipping alert.";
    const invalidChannelMsg =
      "[WARN] Alert channel not a text channel. Skipping alert.";

    if (!this.alertChannel) {
      console.warn(missingChannelMsg);
      return;
    }

    const client = this.getClient(origin);

    if (!client) {
      console.warn(unableToFetchClientMsg);
      return;
    }

    try {
      const channel = await client.channels.fetch(this.alertChannel);

      if (!channel || !channel.isTextBased() || !channel.isSendable()) {
        console.warn(invalidChannelMsg);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("High-Severity Error")
        .setColor(0xef4444)
        .addFields(
          { name: "Error", value: `\`${error.name}\``, inline: true },
          { name: "Code", value: `\`${error.code}\``, inline: true },
          { name: "Message", value: error.message.slice(0, 1024) },
          ...(error.context
            ? [
                {
                  name: "Context",
                  value: `\`\`\`json\n${JSON.stringify(error.context, null, 2).slice(0, 900)}\n\`\`\``,
                },
              ]
            : []),
          ...(error.cause
            ? [
                {
                  name: "Cause",
                  value: `\`${(error.cause as Error).message?.slice(0, 1024)}\``,
                },
              ]
            : []),
        )
        .setTimestamp(error.timestamp);

      await channel.send({ embeds: [embed] });
    } catch (alertError) {
      console.error("[ERROR] Failed to send dev alert:", alertError);
    }
  }

  private buildUserEmbed(error: AppError): EmbedBuilder {
    const colorMap: Record<ErrorSeverity, number> = {
      [ErrorSeverity.LOW]: 0xfacc15, // yellow
      [ErrorSeverity.MEDIUM]: 0xf97316, // orange
      [ErrorSeverity.HIGH]: 0xef4444, // red
    };

    return new EmbedBuilder()
      .setTimestamp(error.timestamp)
      .setDescription(error.userMessage)
      .setColor(colorMap[error.severity])
      .setTitle("⚠️ ¡Hubo un pequeño error! ⚠️")
      .setFooter({ text: `Code: ${error.code}` });
  }

  private getClient(origin: ErrorOrigin): Client | null {
    switch (origin.type) {
      case ErrorOriginType.INTERACTION:
        return origin.source.client;
      case ErrorOriginType.MESSAGE:
        return origin.source.client;
      case ErrorOriginType.BACKGROUND:
        return origin.source;
    }
  }
}
