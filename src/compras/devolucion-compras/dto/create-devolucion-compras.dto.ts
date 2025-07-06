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

class DevolucionDetalleDTO {
    @IsInt()
    producto_id: number;

    @IsDecimal({ decimal_digits: '0,2' })
    @IsPositive()
    cantidad: number;

    @IsDecimal({ decimal_digits: '0,2' })
    costo_unitario: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    iva_porcentaje?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    iva_valor?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    consumo_porcentaje?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    consumo_valor?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    saludable_porcentaje?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    saludable_valor?: number;
}

export class CreateDevolucionComprasDTO {
    @IsInt()
    bodega_id: number;

    @IsString()
    motivo_salida: string;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsDecimal({ decimal_digits: '0,2' })
    total_con_imp: number;

    @IsDecimal({ decimal_digits: '0,2' })
    total_sin_imp: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DevolucionDetalleDTO)
    detalles: DevolucionDetalleDTO[];
}
