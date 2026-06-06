export class User {
    public id: number;
    public fecha_creacion: Date;

    constructor(id: number, fecha_creacion: Date) {
        this.id = id;
        this.fecha_creacion = fecha_creacion;
    }

    static generarCodigoVisual(): string {
        return "USR-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    }
}