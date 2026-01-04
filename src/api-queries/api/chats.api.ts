/**
 * API functions for chat sessions
 * Routes match auphere-backend /api/v1/chat/* endpoints
 */

import axios from 'axios';
import type { ChatSessionsResponse, ChatHistoryResponse } from '../types/chats.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:8000';

export const chatsApi = {
  /**
   * Get all chat sessions for a user
   * Backend route: GET /api/v1/chat/list
   */
  getUserChats: async (userId: string, token?: string | null): Promise<ChatSessionsResponse> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/chat/list`, {
      params: { limit: 100, offset: 0 },
      headers,
    });
    return response.data;
  },

  /**
   * Get chat history for a specific session
   * Backend route: GET /api/v1/chat/{chat_id}/history
   */
  getChatHistory: async (chatId: string, token?: string | null): Promise<ChatHistoryResponse> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/chat/${chatId}/history`, {
      params: { limit: 100 },
      headers,
    });
    return response.data;
  },

  /**
   * Delete a chat session
   * Backend route: DELETE /api/v1/chat/{chat_id}
   */
  deleteChat: async (chatId: string, userId: string, token?: string | null): Promise<void> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await axios.delete(`${API_BASE_URL}/api/v1/chat/${chatId}`, {
      headers,
    });
  },
};

