import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ExtendedValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        console.log(value);
        console.log(metadata);
        return 'ffff'

    }
}