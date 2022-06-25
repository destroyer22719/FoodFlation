"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Item_js_1 = __importDefault(require("./Item.js"));
const Company_js_1 = __importDefault(require("./Company.js"));
let Store = class Store extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.IsUUID)(4),
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "street", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Item_js_1.default),
    __metadata("design:type", Array)
], Store.prototype, "items", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Company_js_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Store.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Company_js_1.default),
    __metadata("design:type", Company_js_1.default)
], Store.prototype, "company", void 0);
Store = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "stores",
        freezeTableName: true,
    })
], Store);
exports.default = Store;
//# sourceMappingURL=Store.js.map