import {
  Table,
  Model,
  Column,
  IsUUID,
  PrimaryKey,
  AllowNull,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Item from "./Item.js";
import Company from "./Company.js";

@Table({
  timestamps: true,
  tableName: "stores",
  freezeTableName: true,
})
export default class Store extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  street: string;

  @AllowNull(false)
  @Column
  city: string;

  @Column
  province: string;

  @Column
  state: string;

  @AllowNull(false)
  @Column
  country: string;

  @Column
  postalCode: string;

  @Column
  zipCode: string;

  @HasMany(() => Item)
  items: Item[];

  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;
}
