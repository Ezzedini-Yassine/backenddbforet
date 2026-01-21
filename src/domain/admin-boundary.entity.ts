import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin_boundary')
export class AdminBoundary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  level: string; // 'region' | 'department' | 'commune' | 'lieuxdit'

  @Column({ nullable: true })
  parent_code: string;

  @Column({ nullable: true })
  population: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326
  })
  geometry: any;

  @CreateDateColumn()
  created_at: Date;
}