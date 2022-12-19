import { Body, Controller, Get, Post, Logger } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { Tags } from './types/tags.type';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
    logger = new Logger('TagsController');
    constructor(private readonly tagsService: TagsService) { }

    @ApiOperation({ summary: 'Get tags' })
    @ApiResponse({ status: 200, schema: { example: { tags: ['name'] } } })
    @Get()
    getTags(): Promise<Tags> {
        this.logger.verbose('Get tags')
        return this.tagsService.getTags();
    }

    /** Aditional feathure */
    @ApiOperation({ summary: 'Create tag' })
    @Post()
    createTag(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
        this.logger.verbose('Creating tag')
        return this.tagsService.createTag(createTagDto);
    }
}
