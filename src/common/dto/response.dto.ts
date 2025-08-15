export class ResponseDto<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;

  constructor(data?: T, message = 'Success', status: 'success' | 'error' = 'success') {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}