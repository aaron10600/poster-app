import { Injectable } from '@nestjs/common';

@Injectable()
export class RawgService {
  private API_URL = 'https://api.rawg.io/api/games';
  private API_KEY = process.env.RAWG_API_KEY;

  async searchGames(query: string) {
    const params = new URLSearchParams({
      key: this.API_KEY!,
      search: query,
      page_size: '10',
    });

    const res = await fetch(`${this.API_URL}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`RAWG API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.results;
  }
}
