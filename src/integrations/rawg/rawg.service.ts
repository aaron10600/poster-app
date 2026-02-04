import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RawgService {
  private API_URL = 'https://api.rawg.io/api/games';
  private API_KEY = process.env.RAWG_API_KEY;

  async searchGames(query: string) {
    const res = await axios.get(this.API_URL, {
      params: {
        key: this.API_KEY,
        search: query,
        page_size: 10,
      },
    });

    return res.data.results;
  }
}
