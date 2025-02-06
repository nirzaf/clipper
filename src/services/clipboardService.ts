import { ClipboardItem } from '../types/clipboard';

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

class ClipboardService {
  private baseUrl: string;
  private tableId: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = 'https://api.baserow.io/api/database/rows/table';
    this.tableId = import.meta.env.VITE_BASEROW_TABLE_ID;
    this.headers = {
      'Authorization': `Token ${import.meta.env.VITE_BASEROW_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'An error occurred while processing your request');
    }

    const data = await response.json();
    return { data, error: null };
  }

  async getNotes(): Promise<ClipboardItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.tableId}/`, {
        headers: this.headers
      });
      const { data } = await this.handleResponse<any>(response);
      console.log('API Response:', data);
      return data.results.map((item: any) => {
        console.log('Item:', item);
        return {
          id: item.id,
          content: item.field_3420228,
          created_at: item.created_on || new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  async createNote(content: string): Promise<ClipboardItem> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.tableId}/`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          field_3420228: content.trim()
        }),
      });
      const { data } = await this.handleResponse<any>(response);
      return {
        id: data.id,
        content: data.field_3420228,
        created_at: new Date(data.created_on).toLocaleString()
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.tableId}/${id}/`, {
        method: 'DELETE',
        headers: this.headers
      });
      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

export const clipboardService = new ClipboardService();
