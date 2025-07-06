import {
    IsArray,
    IsDecimal,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrdenCompraDetalleDTO {
    @IsInt()
    producto_id: number;

    @IsDecimal({ decimal_digits: '0,2' })
    @IsPositive()
    cantidad: number;

    @IsDecimal({ decimal_digits: '0,2' })
    @IsPositive()
    precio_unitario: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    iva_porcentaje?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    consumo_porcentaje?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    saludable_porcentaje?: number;
}

export class CreateOrdenCompraDTO {
    @IsInt()
    proveedor_id: number;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrdenCompraDetalleDTO)
    detalles: OrdenCompraDetalleDTO[];
}
