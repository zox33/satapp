import mongoose, { Schema } from 'mongoose'


const imgSchema = new Schema({
    data: String, 
    contentType: String
});

const asignacionSchema = new Schema({
    tecnico_id: Schema.ObjectId,
    fecha_asignacion: {
      type: Date,
      default: Date.now()
    }
});

const ticketSchema = new Schema({
  creado_por: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now()
  },
  estado: {
    type: String,
    enum: ['PENDIENTE_ASIGNACION', 'ASIGNADA', 'EN_PROCESO', 'SOLUCIONADA'],
    default: 'PENDIENTE_ASIGNACION'
  },
  titulo: {
    type: String
  },
  descripcion: {
    type: String
  },
  inventariable : {
    type: Schema.ObjectId,
    ref: 'Inventariable'
  },
  anotaciones: {
    type: String
  },
  asignaciones: {
    type: [asignacionSchema]
  },
  fecha_tope : {
    type: Date
  },
  fotos: {
    type: [imgSchema]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

ticketSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      creado_por: this.creado_por.view(full),
      fecha_creacion: this.fecha_creacion,
      estado: this.estado,
      titulo: this.titulo,
      descripcion: this.descripcion,
      inventariable: this.inventariable,
      anotaciones: this.anotaciones,
      asignaciones: this.asignaciones,
      fotos: this.fotos.map((foto, i) => '/ticket/img/'+this.id+'/'+i),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Ticket', ticketSchema)

export const schema = model.schema
export default model
