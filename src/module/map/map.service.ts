import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoundaryQueryDto, GetBoundaryDetailsDto, GetForestsDto, SaveMapStateDto } from './dto/save-map-state.dto';
import { ForestData } from 'src/domain/forest-data.entity';
import { AdminBoundary } from 'src/domain/admin-boundary.entity';
import { MapState } from 'src/domain/map-state.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(ForestData)
    private forestDataRepository: Repository<ForestData>,
    
    @InjectRepository(AdminBoundary)
    private adminBoundaryRepository: Repository<AdminBoundary>,
    
    @InjectRepository(MapState)
    private mapStateRepository: Repository<MapState>,
  ) {}

  /**
   * Get forest data within specified bounds or administrative boundary
   */
  async getForests(filters: GetForestsDto) {
    const query = this.forestDataRepository
      .createQueryBuilder('forest')
      .select([
        'forest.id',
        'forest.tfv',
        'forest.code_tfv',
        'forest.taux_couv',
        'forest.hauteur',
        'forest.surface_ha',
        'ST_AsGeoJSON(forest.geometry)::json as geometry',
      ]);

    // Filter by bounding box
    if (filters.minLon && filters.maxLon && filters.minLat && filters.maxLat) {
      const bbox = `POLYGON((
        ${filters.minLon} ${filters.minLat},
        ${filters.maxLon} ${filters.minLat},
        ${filters.maxLon} ${filters.maxLat},
        ${filters.minLon} ${filters.maxLat},
        ${filters.minLon} ${filters.minLat}
      ))`;
      
      query.andWhere(
        'ST_Intersects(forest.geometry, ST_GeomFromText(:bbox, 4326))',
        { bbox }
      );
    }

    // Filter by administrative boundary
    if (filters.department) {
      query.andWhere('forest.code_dept = :dept', { dept: filters.department });
    }

    // Filter by species
    if (filters.species && filters.species.length > 0) {
      query.andWhere('forest.tfv IN (:...species)', { species: filters.species });
    }

    // Limit results
    const limit = filters.limit || 1000;
    query.limit(limit);

    const results = await query.getRawMany();

    return {
      type: 'FeatureCollection',
      features: results.map(r => ({
        type: 'Feature',
        id: r.forest_id,
        properties: {
          tfv: r.forest_tfv,
          code_tfv: r.forest_code_tfv,
          coverage: r.forest_taux_couv,
          height: r.forest_hauteur,
          surface_ha: r.forest_surface_ha,
        },
        geometry: r.geometry,
      })),
    };
  }

  /**
   * Get administrative boundaries by level
   */
  async getBoundaries(filters: BoundaryQueryDto) {
    const query = this.adminBoundaryRepository
      .createQueryBuilder('boundary')
      .select([
        'boundary.id',
        'boundary.name',
        'boundary.code',
        'boundary.level',
        'boundary.parent_code',
        'boundary.population',
        'ST_AsGeoJSON(boundary.geometry)::json as geometry',
      ])
      .where('boundary.level = :level', { level: filters.level });

    // Filter by parent code
    if (filters.parentCode) {
      query.andWhere('boundary.parent_code = :parentCode', { 
        parentCode: filters.parentCode 
      });
    }

    // Filter by bounding box
    if (filters.minLon && filters.maxLon && filters.minLat && filters.maxLat) {
      const bbox = `POLYGON((
        ${filters.minLon} ${filters.minLat},
        ${filters.maxLon} ${filters.minLat},
        ${filters.maxLon} ${filters.maxLat},
        ${filters.minLon} ${filters.maxLat},
        ${filters.minLon} ${filters.minLat}
      ))`;
      
      query.andWhere(
        'ST_Intersects(boundary.geometry, ST_GeomFromText(:bbox, 4326))',
        { bbox }
      );
    }

    const results = await query.getRawMany();

    return {
      type: 'FeatureCollection',
      features: results.map(r => ({
        type: 'Feature',
        id: r.boundary_id,
        properties: {
          name: r.boundary_name,
          code: r.boundary_code,
          level: r.boundary_level,
          parent_code: r.boundary_parent_code,
          population: r.boundary_population,
        },
        geometry: r.geometry,
      })),
    };
  }

  /**
   * Get specific boundary details with child boundaries
   */
  async getBoundaryDetails(dto: GetBoundaryDetailsDto) {
    const boundary = await this.adminBoundaryRepository.findOne({
      where: { code: dto.code, level: dto.level },
    });

    if (!boundary) {
      throw new NotFoundException(`Boundary not found: ${dto.level} ${dto.code}`);
    }

    // Get child boundaries
    const childLevel = this.getChildLevel(dto.level);
    const children = childLevel
      ? await this.adminBoundaryRepository.find({
          where: { parent_code: dto.code, level: childLevel },
        })
      : [];

    return {
      ...boundary,
      children,
    };
  }

  /**
   * Save user's map state
   */
  async saveMapState(userId: string, dto: SaveMapStateDto) {
    let mapState = await this.mapStateRepository.findOne({
      where: { user: { id: userId } },
    });

    if (mapState) {
      // Update existing state
      Object.assign(mapState, dto);
    } else {
      // Create new state
      mapState = this.mapStateRepository.create({
        user: { id: userId } as any,
        ...dto,
      });
    }

    return this.mapStateRepository.save(mapState);
  }

  /**
   * Get user's saved map state
   */
  async getMapState(userId: string) {
    const mapState = await this.mapStateRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mapState) {
      // Return default map state (centered on France)
      return {
        center_lng: 2.3522,
        center_lat: 48.8566,
        zoom: 6,
        bearing: 0,
        pitch: 0,
        active_layers: ['forests', 'boundaries'],
        filters: {},
      };
    }

    return mapState;
  }

  private getChildLevel(level: string): string | null {
    const hierarchy = {
      region: 'department',
      department: 'arrondissement',
      arrondissement: 'commune',
      commune: null,
    };
    return hierarchy[level] || null;
  }
}