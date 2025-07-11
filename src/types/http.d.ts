interface HttpResponse<T> {
  code: string;
  data: T;
  memo: string;
}
