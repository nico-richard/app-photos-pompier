import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { Vehicle } from './Vehicle';

export class View extends Model<
  InferAttributes<View>,
  InferCreationAttributes<View>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string | null;
  declare hash: string;
  declare vehicleId: ForeignKey<Vehicle['id']>;
  declare vehicle?: NonAttribute<Vehicle>;
  declare getVehicle: BelongsToGetAssociationMixin<Vehicle>;

  toString(): string {
    return `[${this.id}]${this.name} ${this.url} ${this.hash} ${this.vehicleId}`;
  }
}
