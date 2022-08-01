import {
    Table,
    Model,
    IsUUID,
    PrimaryKey,
    Column,
    HasMany,
    AllowNull,
    IsUrl,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import Price from "./Price";
import Store from "./Store";

@Table({
    timestamps: true,
    tableName: "items",
    freezeTableName: true,
})
export default class Item extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @AllowNull(false)
    @Column
    name: string;

    @HasMany(() => Price)
    prices: Price[];

    @ForeignKey(() => Store)
    @Column
    storeId: string;

    @BelongsTo(() => Store)
    store: Store;

    @IsUrl
    @Column
    imgUrl: string;
}
