export interface CharacterResponse {
  code: number,
  etag: string,
  data: {
    count: number,
    limit: number,
    offset: number,
    results: Character[],
    total: number
  }
}
export interface Character {
  id: number,
  name: string,
  description: string,
  thumbnail: any,
}
