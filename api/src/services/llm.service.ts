import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class LLMService {
  private model: ChatGroq;

  /**
   * Construct a new LLMService instance.
   *
   * @param modelName the name of the LLM to use
   * @param temperature the temperature to use when generating text,
   *     defaults to 0.7 if not provided
   * @param maxTokens the maximum number of tokens to generate,
   *     defaults to 1024 if not provided
   */
  constructor(modelName: string, temperature: number, maxTokens: number) {
    this.model = new ChatGroq({
      model: modelName,
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 1024,
    });
  }

  /**
   * Sends a message to the AI model and retrieves the response.
   *
   * @param systemMessage The system message to set the context.
   * @param humanMessage The human message to send.
   * @returns The response from the AI model.
   * @throws Error if the model invocation fails.
   */
  async sendMessageToModel(systemMessage: string, humanMessage: string): Promise<string> {
    const messages = [new SystemMessage(systemMessage), new HumanMessage(humanMessage)];
    const response = await this.model.invoke(messages);
    return response.content.toString();
  }
}
