export interface Cafe {
  id: number;
  cafe: string;
  especialidad: string;
  presentacion: string;
  origen: string;
  cantidad: number;
  valor: number;
  descripcion: string | null;
}

export type CafeForm = Omit<Cafe, 'id'>;
