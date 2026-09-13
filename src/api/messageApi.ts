import type { Conversation, Message } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  getMockMessagesFor,
  buildFreshConversation,
} from "../data";

function runtimeStore() {
  try {
    const raw = localStorage.getItem("alumniConnectUser");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

export async function getConversationsApi(): Promise<Conversation[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return [...MOCK_CONVERSATIONS];
  }
  try {
    const { data } = await api.get<
      Conversation[] | { success: boolean; conversations: Conversation[]; data?: Conversation[] }
    >("/messages/conversations");
    if (Array.isArray(data)) return data;
    return data?.conversations ?? data?.data ?? [];
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch conversations"));
  }
}

export async function getMessagesApi(userId: string): Promise<Message[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return getMockMessagesFor(userId);
  }
  try {
    const { data } = await api.get<
      Message[] | { success: boolean; messages: Message[]; data?: Message[] }
    >(`/messages/${userId}`);
    if (Array.isArray(data)) return data;
    return data?.messages ?? data?.data ?? [];
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch messages"));
  }
}

export async function sendMessageApi(
  receiverId: string,
  message: string,
): Promise<Message> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const senderId = runtimeStore()._id ?? "alu-1";
    const msg: Message = {
      _id: `m-${Date.now()}`,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    if (!MOCK_MESSAGES[receiverId]) MOCK_MESSAGES[receiverId] = [];
    MOCK_MESSAGES[receiverId] = [...MOCK_MESSAGES[receiverId], msg];

    const existing = MOCK_CONVERSATIONS.find((c) => c.user._id === receiverId);
    if (existing) {
      existing.lastMessage = message;
      existing.lastTimestamp = msg.timestamp;
    } else {
      MOCK_CONVERSATIONS.unshift(buildFreshConversation(receiverId));
      const fresh = MOCK_CONVERSATIONS[0];
      fresh.lastMessage = message;
      fresh.lastTimestamp = msg.timestamp;
    }
    return msg;
  }
  try {
    const { data } = await api.post<{ success: boolean; message: Message }>(
      "/messages",
      { receiverId, message },
    );
    return data.message;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to send message"));
  }
}