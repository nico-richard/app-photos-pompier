import {
  Association,
  CreationOptional,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { View } from './View';
import { Stringifiable } from './Stringifiable';
import { Brand } from './Brand';

export class Vehicle
  extends Model<
    InferAttributes<Vehicle, { omit: 'views' }>,
    InferCreationAttributes<Vehicle, { omit: 'views' }>
  >
  implements Stringifiable
{
  declare id: CreationOptional<number>;
  declare brandId: ForeignKey<Brand['id']>;
  declare brand?: NonAttribute<Brand>;
  declare model: string | null;
  declare equipment: string | null;
  declare owner: string | null;
  declare date: number | null;
  declare comment: string | null;
  declare license: string | null;
  declare getViews: HasManyGetAssociationsMixin<View>;
  declare addView: HasManyAddAssociationMixin<View, number>;
  declare addViews: HasManyAddAssociationsMixin<View, number>;
  declare setViews: HasManySetAssociationsMixin<View, number>;
  declare removeView: HasManyRemoveAssociationMixin<View, number>;
  declare removeViews: HasManyRemoveAssociationsMixin<View, number>;
  declare hasView: HasManyHasAssociationMixin<View, number>;
  declare hasViews: HasManyHasAssociationsMixin<View, number>;
  declare createView: HasManyCreateAssociationMixin<View, 'vehicleId'>;
  declare countViews: HasManyCountAssociationsMixin;
  declare views?: NonAttribute<View[]>;

  declare static associations: {
    views: Association<Vehicle, View>;
  };

  toString() {
    return `[${this.id}]${this.brand} ${this.model}`;
  }
}
