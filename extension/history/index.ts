import { IChatHistoryManager } from "components/chat-widget/widget";
import { Message, Role } from "utils/types";

export class ChatHistoryManager implements IChatHistoryManager {
  private readonly tokenLimit: number;
  private readonly historySummrizer: (history: Message[]) => Promise<Message>;
  private chatHistory: Message[] = [];

  constructor({
    tokenLimit,
    historySummrizer,
  }: {
    tokenLimit: number;
    historySummrizer: (history: Message[]) => Promise<Message>;
  }) {
    this.tokenLimit = tokenLimit;
    this.historySummrizer = historySummrizer;
  }
  // Add a message to chat history
  async addMessage({ role, content, tokenUsage }: Message): Promise<void> {
    // If token limit is exceeded, summarize history
    const totalTokenUsage = this.getTokenUsage();

    if (totalTokenUsage > this.tokenLimit) {
      await this.summarizeHistory();
    }

    const newMessage: Message = { role, content, tokenUsage };
    this.chatHistory.push(newMessage);
  }

  getTokenUsage(): number {
    return this.chatHistory.reduce((acc, curr) => acc + curr.tokenUsage, 0);
  }

  getTokenUsageInPercentage(): string {
    return `${((this.getTokenUsage() * 100) / this.tokenLimit).toFixed(0)}%`;
  }

  // Summarize chat history
  async summarizeHistory() {
    const summary = await this.historySummrizer(this.chatHistory);
    this.chatHistory = [summary];
  }

  // Get chat history
  getMessages(): Message[] {
    return this.chatHistory;
  }

  // Remove last message from chat history
  deleteLastMessage() {
    this.chatHistory.pop();
  }
}
