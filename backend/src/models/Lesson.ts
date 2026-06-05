export class Lesson {
    public id: number;
    public numero: number;
    public nombre: string;
    public descripcion: string | null;

    constructor(id: number, numero: number, nombre: string, descripcion: string | null) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}