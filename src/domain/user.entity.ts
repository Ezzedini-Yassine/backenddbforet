import {
    Entity,
    Column,
  } from 'typeorm';
  import { BaseEntity } from './base/base.entity';
  import { Role } from './enums/role.enum';
  
  @Entity({ name: 'user' })
  export class User extends BaseEntity {
    @Column({ unique: true})
    username: string ;
    @Column({nullable: true})
    phoneNumber: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: Role})
    roles: Role;
    @Column({ nullable: true})
    imageUrl?: string;
    @Column({ default: 'en'})
    langKey?: string;
    // NOTE: When using union types like 'string | null', you MUST explicitly specify 
    // the column type (e.g., type: 'varchar') because TypeORM's reflection cannot 
    // infer database types from TypeScript union types at runtime. Without this, 
    // TypeORM will throw "Data type 'Object' is not supported" error.
    @Column({ type: 'varchar', nullable: true})
    refreshToken: string | null;
  
  }
  