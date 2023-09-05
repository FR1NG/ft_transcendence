import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Users, UsersRooms} from "@prisma/client";

export enum Actions {
  manage = 'manage',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete'
};

type Subjects = InferSubjects<any>

export type RoomAbility = Ability<[Actions, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForRoom(room: UsersRooms) {
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<RoomAbility>);
    if(room.role === 'OWNER')
      can(Actions.manage, 'room');

    if(room.role === 'ADMIN') {
      cannot(Actions.delete, 'room');
      can(Actions.create, 'room');
      can(Actions.read, 'room');
      can(Actions.update, 'room');
    }

    if(room.role === 'USER')
      can(Actions.read, 'room')
    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
