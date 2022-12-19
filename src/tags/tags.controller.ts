import { Body, Controller, Get, Post } from '@nestjs/common';

import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { Tags } from './types/tags.type';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @ApiOperation({ summary: 'Get tags' })
    @ApiResponse({ status: 200, schema: { example: { tags: ['name'] } } })
    @Get()
    getTags(): Promise<Tags> {
        return this.tagsService.getTags();
    }

    /** Aditional feathure */
    @ApiOperation({ summary: 'Create tag' })
    @Post()
    createTag(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
        return this.tagsService.createTag(createTagDto);
    }
}
