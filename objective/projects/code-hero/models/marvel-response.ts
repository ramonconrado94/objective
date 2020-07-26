export interface MarvelResponse {
  code: number,
  etag: string,
  data: {
    count: number,
    limit: number,
    offset: number,
    results: {
      id: number,
      name: string,
      description: string,
      thumbnail: any,
      image: any,
    }[],
    total: number
  }
}


