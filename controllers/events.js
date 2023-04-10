const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

    try {
        const eventos = await Evento.find().populate('user', 'name')
        res.json({
            ok: true,
            eventos
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error'
        })
    }
}

const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body)

    try {
        evento.user = req.uid
        const eventoGuardado = await evento.save()
        
        res.json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error'
        })
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId)

        if(!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Hubo un error al encontrar el evento'
            })
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                    ok: false,
                    msg: 'No esta autorizado'
                })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        res.json({
            ok: true,
            evento: eventoActualizado
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error'
        })
    }
}

const eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId)

        if(!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Hubo un error al encontrar el evento'
            })
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                    ok: false,
                    msg: 'No esta autorizado'
                })
        }

        const eventoEliminado = await Evento.findOneAndDelete(eventoId)

        res.json({
            ok: true,
            evento: eventoEliminado
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}