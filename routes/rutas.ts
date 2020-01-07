import { Router, Request, Response } from "express";
import RutaControllers from '../controllers/rutaControllers';
import { Mapa } from '../controllers/mapa';
import { Ubicacion } from '../models/ubicacion';
import { rutabus } from "../sockets/sockets";

const router = Router();
const rutaControllers = new RutaControllers();

// Mapa
export const mapa = new Mapa();

const ubicaciones: Ubicacion[] = [
    {
        id: '1',
        nombre: 'Mi Casa',
        latitud: 10.969727719654152,
        longitud: -74.8088872968201
    },
    {
        id: '2',
        nombre: 'Iglesia Cristiana',
        latitud: 10.97871995957737,
        longitud: -74.80157136903381
    },
    {
        id: '3',
        nombre: 'Empresa Cloud Technologys Center',
        latitud: 10.982584272007262,
        longitud: -74.7945893126892
    }
  ];

// "..." Permite agregar cada elemento del arreglo de manera independiente
mapa.marcadores.push( ...ubicaciones );

// GET - todos los marcadores
router.get('/marcadores', ( req: Request, res: Response  ) => {
    res.json( mapa.getMarcadores() );
});

// GET - cargamos todos los puntos de las rutas desde la BD
router.get('/rutasdb', ( req: Request, res: Response  ) => {

    rutaControllers.cargarRutas().then( ( data: any ) => {

        if( data ) {
            return res.json({
                ok: true,
                resp: data
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO HAY REGISTROS'
            });
        }

    }).catch((err: any) => {
        return res.status(500).json({
            ok: false,
            mensaje: 'ERROR SERVER'
        });
    });

});

router.get('/rutasxanio/:codanio', ( req: Request, res: Response  ) => {

    const codanio = req.params.codanio;

    if( codanio != '' ) {

        rutaControllers.cargarRutasxCodanio( codanio ).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'NO HAY REGISTROS'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER'
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

router.get('/rutasmultiples', ( req: Request, res: Response  ) => {

    const arrayRutas = req.body.arrayrutas;

    console.log( arrayRutas );

    if( arrayRutas != [] ) {

        rutaControllers.cargarMultiplesRutas( arrayRutas ).then( ( data: any ) => {

            if( data ) {
                return res.json({
                    ok: true,
                    resp: data
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'NO HAY REGISTROS'
                });
            }

        }).catch((err: any) => {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR SERVER'
            });
        });

    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Parametro no recibido'
        });
    }

});

// GET - cargamos todos los puntos de las rutas
router.get('/rutas', ( req: Request, res: Response  ) => {
    res.json( rutabus.obtenerRutas() );
});

// GET - Cargamos todos los puntos de un marcador
router.get('/marcador/:id', ( req: Request, res: Response  ) => {
    // Parametro ID del marcador 
    const id = req.params.id;
    res.json( rutabus.obtenerRutaMarcador( id ) );
});

// POST - todos los puntos de un marcador
router.delete('/eliminarruta', ( req: Request, res: Response  ) => {

    rutabus.eliminarRutas();

    res.json({
        ok: true,
        mensaje: 'puntos de ruta eliminados'
    });
});

// POST - todos los puntos de ruta
router.delete('/eliminarmarcador/:id', ( req: Request, res: Response  ) => {

    // Parametro ID del marcador
    const id = req.params.id;
    rutabus.eliminarUbicacionMarcador( id );

    res.json({
        ok: true,
        mensaje: 'puntos de ruta eliminados'
    });
});


export default router;