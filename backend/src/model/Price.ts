import {
    Table,
    Model,
    IsUUID,
    PrimaryKey,
    Column,
    BelongsTo,
    AllowNull,
    ForeignKey,
    DataType,
} from "sequelize-typescript";
import Item from "./Item.js";

@Table({
    timestamps: true,
    tableName: "prices",
    freezeTableName: true,
})
export default class Price extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @AllowNull(false)
    @Column({
        type: DataType.FLOAT,
    })
    price: number;

    @BelongsTo(() => Item)
    item: Awaited<Item>;

    @AllowNull(false)
    @ForeignKey(() => Item)
    @Column
    itemId: string;
}
