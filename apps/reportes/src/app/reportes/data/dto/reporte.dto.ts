export interface ReporteDto {
  id: string;
  endpoint: string;
}

export interface ReportesResponseDto {
  success: boolean;
  data: ReporteDto[];
}
