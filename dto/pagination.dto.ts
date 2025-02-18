//Context: When your db has millions of records causing server crashed
//Pagination give 2 query parameters (skip & limit)

import { IsNumber, IsOptional, IsPositive } from "class-validator";


export class PaginationDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip:number; //specify the number of records before starting to return the result
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit:number; //the maximum records that will return with a single query
}