import { IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';

export type ArticleType = 'Technical_Solution' | 'TTE_Event' | 'Industry_News';
export type Language = 'en' | 'vi';
export type Tone = 'professional' | 'friendly' | 'technical';

export class GenerateArticleDto {
    @IsString()
    topic: string;

    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @IsEnum(['Technical_Solution', 'TTE_Event', 'Industry_News'])
    type: ArticleType;

    @IsEnum(['en', 'vi'])
    @IsOptional()
    language?: Language = 'vi';

    @IsEnum(['professional', 'friendly', 'technical'])
    @IsOptional()
    tone?: Tone = 'professional';

    @IsNumber()
    @IsOptional()
    targetLength?: number = 800;
}
