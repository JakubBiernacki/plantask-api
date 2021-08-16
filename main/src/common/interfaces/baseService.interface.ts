export interface IBaseService {
  findAll(pagination);
  findOne(id);
  create(dto);
  update(id, dto);
  remove(id);
}
