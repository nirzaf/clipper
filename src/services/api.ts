import axios from 'axios';

const baserowApi = axios.create({
  baseURL: 'https://api.baserow.io/api/database/rows/table/',
  headers: {
    'Authorization': `Token ${import.meta.env.VITE_BASEROW_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ID;

export const clipboardApi = {
  getNotes: async () => {
    const response = await baserowApi.get(`${TABLE_ID}/`);
    return response.data.results.map((item: any) => ({
      id: item.id,
      content: item.field_3420228
    }));
  },

  createNote: async (content: string) => {
    await baserowApi.post(`${TABLE_ID}/`, {
      field_3420228: content.trim()
    });
  },

  deleteNote: async (id: number) => {
    await baserowApi.delete(`${TABLE_ID}/${id}/`);
  }
};
