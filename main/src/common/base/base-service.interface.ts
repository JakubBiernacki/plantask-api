export interface IBaseService<T> {
  findAll(pagination): Promise<T[]>;
  findOne(id): Promise<T>;
  create(dto): Promise<T>;
  update(id, dto): Promise<T>;
  remove(id): Promise<T>;
}
