import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('forest_data')
export class ForestData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  code_tfv: string;

  @Column({ nullable: true })
  libelle_fr: string;

  @Column({ nullable: true })
  tfv_g11: string;

  @Column({ nullable: true })
  essence_1: string;

  @Column({ nullable: true })
  essence_2: string;

  @Column({ nullable: true })
  essence_3: string;

  @Column('double precision', { nullable: true })
  area_ha: number;

  @Column({ nullable: true })
  department: string;

  // ⚠️ TypeORM doesn't handle PostGIS geometry well
  // We'll use raw queries for geometry operations
  // But we declare it so TypeORM knows it exists
  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
    nullable: false
  })
  geometry: any; // We'll use ST_AsGeoJSON in queries

  @CreateDateColumn()
  created_at: Date;
}