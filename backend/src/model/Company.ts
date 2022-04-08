import {
    Table,
    Model,
    Column,
    IsUUID,
    PrimaryKey,
    AllowNull,
    HasMany,
} from "sequelize-typescript";
import Store from "./Store.js";

@Table({
    timestamps: true,
    tableName: "company",
    freezeTableName: true,
})
export default class Company extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @AllowNull(false)
    @Column
    name: string;

    @HasMany(() => Store)
    stores: Store[];
}
