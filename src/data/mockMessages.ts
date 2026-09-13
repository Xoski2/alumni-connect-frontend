import type { Conversation, Message } from "../types";
import { MOCK_ALUMNI } from "./mockUsers";

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

const CURR_USER = "alu-1";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    user: { _id: "alu-2", name: "Malibongwe Ndlovu", role: "alumni" },
    lastMessage: "Sounds great — let's schedule it for Thursday.",
    lastTimestamp: hoursAgo(1),
    unreadCount: 2,
  },
  {
    user: { _id: "alu-3", name: "Vimbai Ndlovu", role: "alumni" },
    lastMessage: "I'll send you the meeting link before the session.",
    lastTimestamp: hoursAgo(4),
    unreadCount: 0,
  },
  {
    user: { _id: "std-1", name: "Tapiwa Moyo", role: "student" },
    lastMessage: "Thank you so much for the interview tips!",
    lastTimestamp: hoursAgo(9),
    unreadCount: 0,
  },
  {
    user: { _id: "std-4", name: "Nyaradzo Dube", role: "student" },
    lastMessage: "Are you attending the mentorship kickoff?",
    lastTimestamp: hoursAgo(26),
    unreadCount: 0,
  },
  {
    user: { _id: "alu-10", name: "Panashe Ncube", role: "alumni" },
    lastMessage: "Added you to the study group on Monday.",
    lastTimestamp: hoursAgo(50),
    unreadCount: 1,
  },
  {
    user: { _id: "alu-5", name: "Thabo Mdluli", role: "alumni" },
    lastMessage: "Great, I'll review your CV over the weekend.",
    lastTimestamp: hoursAgo(72),
    unreadCount: 0,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "alu-2": [
    { _id: "m-1", senderId: CURR_USER, receiverId: "alu-2", message: "Hey! Wanted to check when you're free for the mentoring prep.", timestamp: hoursAgo(6) },
    { _id: "m-2", senderId: "alu-2", receiverId: CURR_USER, message: "Hi Tinashe! I'm free most afternoons this week.", timestamp: hoursAgo(5) },
    { _id: "m-3", senderId: CURR_USER, receiverId: "alu-2", message: "Perfect — how does Thursday 3PM work?", timestamp: hoursAgo(3) },
    { _id: "m-4", senderId: "alu-2", receiverId: CURR_USER, message: "Works for me. I'll put together the interview framework.", timestamp: hoursAgo(2) },
    { _id: "m-5", senderId: CURR_USER, receiverId: "alu-2", message: "Amazing, thanks!", timestamp: hoursAgo(1) },
    { _id: "m-6", senderId: "alu-2", receiverId: CURR_USER, message: "Sounds great — let's schedule it for Thursday.", timestamp: hoursAgo(1) },
  ],
  "alu-3": [
    { _id: "m-7", senderId: "alu-3", receiverId: CURR_USER, message: "Hi! Ready for Friday's Git bootcamp?", timestamp: hoursAgo(6) },
    { _id: "m-8", senderId: CURR_USER, receiverId: "alu-3", message: "Yes — pinging some students to attend too.", timestamp: hoursAgo(5) },
    { _id: "m-9", senderId: "alu-3", receiverId: CURR_USER, message: "I'll send you the meeting link before the session.", timestamp: hoursAgo(4) },
  ],
  "std-1": [
    { _id: "m-10", senderId: "std-1", receiverId: CURR_USER, message: "Thanks for the career fair advice!", timestamp: hoursAgo(12) },
    { _id: "m-11", senderId: CURR_USER, receiverId: "std-1", message: "Anytime. Come with a tailored CV.", timestamp: hoursAgo(11) },
    { _id: "m-12", senderId: "std-1", receiverId: CURR_USER, message: "Will do. Thank you so much for the interview tips!", timestamp: hoursAgo(9) },
  ],
  "std-4": [
    { _id: "m-13", senderId: "std-4", receiverId: CURR_USER, message: "Hey — are you attending the mentorship kickoff breakfast?", timestamp: hoursAgo(30) },
    { _id: "m-14", senderId: CURR_USER, receiverId: "std-4", message: "Yes, I'll be there. See you at the cafeteria!", timestamp: hoursAgo(28) },
    { _id: "m-15", senderId: "std-4", receiverId: CURR_USER, message: "Are you attending the mentorship kickoff?", timestamp: hoursAgo(26) },
  ],
  "alu-10": [
    { _id: "m-16", senderId: "alu-10", receiverId: CURR_USER, message: "Added you to the study group on Monday.", timestamp: hoursAgo(50) },
  ],
  "alu-5": [
    { _id: "m-17", senderId: CURR_USER, receiverId: "alu-5", message: "Sent you my CV for a quick review.", timestamp: hoursAgo(80) },
    { _id: "m-18", senderId: "alu-5", receiverId: CURR_USER, message: "Great, I'll review your CV over the weekend.", timestamp: hoursAgo(72) },
  ],
};

export function getMockMessagesFor(userId: string): Message[] {
  return MOCK_MESSAGES[userId] ?? [];
}

export function getMockConversationFor(userId: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.user._id === userId);
}

export function buildFreshConversation(userId: string): Conversation {
  const peer =
    MOCK_ALUMNI.find((a) => a._id === userId) ??
    MOCK_ALUMNI.find((a) => a._id === "alu-2")!;
  return {
    user: { _id: peer._id, name: peer.name, role: peer.role, profilePhoto: peer.profilePhoto },
    lastMessage: "Start the conversation",
    lastTimestamp: new Date().toISOString(),
    unreadCount: 0,
  };
}