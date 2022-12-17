import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TagEntity } from './entities/tag.entity';
import { CreateTagType } from './types/tag.type';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) { }

    async getTags(): Promise<string[]> {
        try {
            return await this.tagRepository.find()
                .then(tags => tags.map(tag => tag.name));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async createTag(createTag: CreateTagType): Promise<TagEntity> {
        try {
            return await this.tagRepository.save(createTag);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
}
