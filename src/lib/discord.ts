const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1518108421667422390/kg_MHu9MFkrnvadWlHgVIt9NmX1AMLkyN4EU59TvGIDxHlx5mgwb1VyqiMJ7MmgSprdl';

export async function sendDiscordWebhook(amount: number, username?: string): Promise<void> {
  try {
    const payload = {
      content: `💰 **Deposit Made**\n\nAmount: ${amount.toFixed(3)} SOL${username ? `\nUser: ${username}` : ''}`,
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
  }
}
