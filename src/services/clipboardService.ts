interface ClipboardItem {
  id: number;
  content: string;
  created_at: string; // Add created_at if it's part of the data you want to preserve during the refactor. It wasn't in the provided axios example, so I'm including it here for completeness.
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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'An error occurred'}`);
    }
    try {
      return await response.json() as T;
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${e}`);
    }
  }

  async getNotes(): Promise<ClipboardItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.tableId}/`, {
        headers: this.headers
      });

      const data = await this.handleResponse<{ results: any[] }>(response);

      if (!data || !data.results) {
        console.warn("No data or results found in API response.");
        return [];
      }

      return data.results.map((item: any) => ({
        id: item.id,
        content: item.field_3420228,
        created_at: item.created_on || new Date().toISOString() //Include created_at, but provide default
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  async createNote(content: string): Promise<void> { //Return type void to match original behavior
    try {
      await fetch(`${this.baseUrl}/${this.tableId}/`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          field_3420228: content.trim()
        }),
      });
      // original axios implementation returned nothing on create.  No need to handle response.
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async deleteNote(id: number): Promise<void> { //Return type void to match original behavior
    try {
      const response = await fetch(`${this.baseUrl}/${this.tableId}/${id}/`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete note: ${response.status} - ${errorText}`);
      }
      if (response.status !== 204) { // Check for 204 No Content. Baserow API should return this.
        console.warn(`Delete response status was not 204: ${response.status}.  Checking if deletion was successful.`);
      }

    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

export const clipboardService = new ClipboardService();