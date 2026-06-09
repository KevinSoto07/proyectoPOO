export class Calificacion {
    public id: number;
    public usuario_id: number;
    public actividad_id: number;
    public puntaje_obtenido: number;
    public fecha: Date;

    constructor(id: number, usuario_id: number, actividad_id: number, puntaje_obtenido: number, fecha: Date) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.actividad_id = actividad_id;
        this.puntaje_obtenido = puntaje_obtenido;
        this.fecha = fecha;
    }
}