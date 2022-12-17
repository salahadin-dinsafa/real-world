import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    getTags(): Promise<string[]> {
        return this.tagsService.getTags();
    }

    /** Aditional feathure */
    @Post()
    createTag(@Body() createTagDto: CreateTagDto): Promise<TagEntity> {
        return this.tagsService.createTag(createTagDto);
    }
}
