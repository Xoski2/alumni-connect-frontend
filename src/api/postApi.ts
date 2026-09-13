import type { Post, CreatePostInput } from "../types";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_POSTS } from "../data";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

function currentIdentity() {
  try {
    const raw = localStorage.getItem("alumniConnectUser");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { _id: "alu-1", name: "Tinashe Dlamini", role: "alumni" };
}

/** In mock mode localStorage identity is "alu-1" for the demo profile. */
function postAuthorYours() {
  const identity = currentIdentity();
  return {
    _id: identity._id ?? "alu-1",
    name: identity.name ?? "Tinashe Dlamini",
    role: identity.role ?? "alumni",
    position: identity.position,
    department: identity.department,
    graduationYear: identity.graduationYear,
  };
}

export async function getFeedApi(): Promise<Post[]> {
  if (MOCK_MODE) {
    await mockDelay();
    return [...MOCK_POSTS];
  }
  // Real backend not implemented yet — always serve mock even outside mock mode.
  await mockDelayFast();
  return [...MOCK_POSTS];
}

export async function createPostApi(
  input: CreatePostInput,
): Promise<Post> {
  await mockDelay();
  const post: Post = {
    _id: `post-${Date.now()}`,
    author: postAuthorYours(),
    category: input.category,
    text: input.text,
    imageUrl: input.imageUrl,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  MOCK_POSTS.unshift(post);
  return post;
}

export async function toggleLikePostApi(id: string): Promise<Post> {
  await mockDelayFast();
  const post = MOCK_POSTS.find((p) => p._id === id);
  if (!post) throw new Error("Post not found");
  const me = currentIdentity()._id ?? "alu-1";
  const hasLiked = post.likes.includes(me);
  post.likes = hasLiked
    ? post.likes.filter((l) => l !== me)
    : [...post.likes, me];
  return post;
}

export async function addCommentApi(
  id: string,
  text: string,
): Promise<Post> {
  await mockDelayFast();
  const post = MOCK_POSTS.find((p) => p._id === id);
  if (!post) throw new Error("Post not found");
  const identity = currentIdentity();
  post.comments.push({
    _id: `pc-${Date.now()}`,
    userId: identity._id ?? "alu-1",
    authorName: identity.name ?? "Tinashe Dlamini",
    authorRole: identity.role ?? "alumni",
    text,
    createdAt: hoursAgo(0),
  });
  return post;
}

export async function editPostApi(id: string, text: string): Promise<Post> {
  await mockDelayFast();
  const post = MOCK_POSTS.find((p) => p._id === id);
  if (!post) throw new Error("Post not found");
  post.text = text;
  return post;
}

export async function deletePostApi(id: string): Promise<void> {
  await mockDelayFast();
  const idx = MOCK_POSTS.findIndex((p) => p._id === id);
  if (idx >= 0) MOCK_POSTS.splice(idx, 1);
}

export { MOCK_MODE as isFeedMocked };