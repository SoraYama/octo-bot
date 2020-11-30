export default class Octo {
  public constructor(public ROOT: string) {
    if (!ROOT) {
      throw new Error('缺少 ROOT 路径');
    }
  }
}
