// ============================================
// get-forests.dto.ts
// ============================================
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

export class GetForestsDto {
  @IsOptional()
  @IsNumber()
  minLon?: number;

  @IsOptional()
  @IsNumber()
  maxLon?: number;

  @IsOptional()
  @IsNumber()
  minLat?: number;

  @IsOptional()
  @IsNumber()
  maxLat?: number;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsArray()
  species?: string[]; // Filter by tree species

  @IsOptional()
  @IsNumber()
  limit?: number;
}

// ============================================
// save-map-state.dto.ts
// ============================================
import { IsObject } from 'class-validator';

export class SaveMapStateDto {
  @IsNumber()
  center_lng: number;

  @IsNumber()
  center_lat: number;

  @IsNumber()
  zoom: number;

  @IsOptional()
  @IsNumber()
  bearing?: number;

  @IsOptional()
  @IsNumber()
  pitch?: number;

  @IsOptional()
  @IsArray()
  active_layers?: string[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

// ============================================
// boundary-query.dto.ts
// ============================================
import { IsEnum } from 'class-validator';

export enum BoundaryLevel {
  REGION = 'region',
  DEPARTMENT = 'department',
  ARRONDISSEMENT = 'arrondissement',
  COMMUNE = 'commune',
}

export class BoundaryQueryDto {
  @IsEnum(BoundaryLevel)
  level: BoundaryLevel;

  @IsOptional()
  @IsString()
  parentCode?: string; // Filter by parent boundary

  @IsOptional()
  @IsNumber()
  minLon?: number;

  @IsOptional()
  @IsNumber()
  maxLon?: number;

  @IsOptional()
  @IsNumber()
  minLat?: number;

  @IsOptional()
  @IsNumber()
  maxLat?: number;
}

export class GetBoundaryDetailsDto {
  @IsEnum(BoundaryLevel)
  level: BoundaryLevel;

  @IsString()
  code: string;
}