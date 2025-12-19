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
    @Column({ nullable: true})
    refreshToken: string;
  
  }
  