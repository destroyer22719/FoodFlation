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
    tableName: "price",
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
    item: Item;

    @ForeignKey(() => Item)
    @Column
    itemId: string;
}
