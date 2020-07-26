export interface DetailResponse {
  code: number,
  etag: string,
  data: {
    count: number,
    limit: number,
    offset: number,
    results: Detail[],
    total: number
  }
}
export interface Detail {
  id: number,
  title: string,
  description: string,
  thumbnail: any,
}
