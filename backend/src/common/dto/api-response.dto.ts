export class ApiResponse<T = any> {
  constructor(
    public data: T,
    public message?: string,
  ) {}
}
