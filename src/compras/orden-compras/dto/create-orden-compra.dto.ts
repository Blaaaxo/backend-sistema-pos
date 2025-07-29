import {
    IsArray,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    IsNumber,
    ValidateNested,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrdenCompraDetalleDTO {
    @IsInt()
    @Type(() => Number)
    producto_id: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Type(() => Number)
    cantidad: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Type(() => Number)
    precio_unitario: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @Type(() => Number)
    iva_porcentaje?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @Type(() => Number)
    consumo_porcentaje?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @Type(() => Number)
    saludable_porcentaje?: number;
}

export class CreateOrdenCompraDTO {
    @IsInt()
    @Type(() => Number)
    proveedor_id: number;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrdenCompraDetalleDTO)
    detalles: OrdenCompraDetalleDTO[];
}
