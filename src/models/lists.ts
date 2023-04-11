import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "lists",
})
export class List extends Model<List> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  parent!: number;
}
