//servidor.js
const express = require('express');
const app = express();

app.use(express.json());

//array de jugadores del torneo (será nuestra base de datos personal)
let jugadores = [
    {id: 1, nickname: "DragonSlayer", juego: "League of Legends", nivel: "Pro", país: "Colombia"},
    {id: 2, nickname: "ShadowNinja", juego: "Counter Strike Global Offensive", nivel: "Pro", país: "México"},
    {id: 3, nickname: "FireMage", juego: "Valorant", nivel: "Amateur", país: "Argentina"}   
];

//Obtener Jugadores por ID
app.get('/jugador/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jugador = jugadores.find(j => j.id === id);

    if (!jugador) {
        return res.status(404).json({ mensaje: 'Jugador no encontrado en el torneo' });
    }    

    res.json(jugador);
});

//Obtener todos los jugadores con filtros
app.get('/jugadores', (req, res) =>{
    const limite = parseInt(req.query.limite);
    const juego = req.query.juego;
    const nivel = req.query.nivel;
    const país = req.query.país;
    const nickname = req.query.nickname;

    let resultado = jugadores;

    //filtrar por juego
    if (juego) {
        resultado = resultado.filter(j =>
            j.juego.toLowerCase().includes(juego.toLowerCase())
        );
    }

    //filtrar por nivel
    if (nivel) {
        resultado = resultado.filter(j =>
            j.nivel.toLowerCase().includes(nivel.toLowerCase())
        );
    }

    //filtrar por país
    if (país) {
        resultado = resultado.filter(j =>
            j.país.toLowerCase().includes(país.toLowerCase())
        );
    }

    //buscar por nickname
    if (nickname) {
        resultado = resultado.filter(j =>
            j.nickname.toLowerCase().includes(nickname.toLowerCase())
        );
    }

    //aplicar límite
    if (limite) {
        resultado = resultado.slice(0, limite);
    }

    res.json(resultado);
});

//agregar al servidor .js

let proximoID= 4

//Registrar Nuevo Jugador
app.post('/jugadores', (req, res) => {
    const {nickname, juego, nivel, país} = req.body;

    //Validaciones
    if (!nickname || !juego || !nivel || !país) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }


//verificar que el nickname no esté repetido
const nicknameExiste = jugadores.find(j =>
    j.nickname.toLowerCase() === nickname.toLowerCase()
);

if (nicknameExiste) {
    return res.status(409).json({ Error: 'Este Nickname ya está en uso' });
}

const nuevoJugador = {
    id: proximoID++,
    nickname: nickname,
    juego: juego,
    nivel: nivel,
    país: país
};

jugadores.push(nuevoJugador);
res.status(201).json({
    mensaje: 'Jugador registrado con éxito en el Torneo',
    jugador: nuevoJugador
});
})

app.listen(3000, () => {
    console.log('API Torneo Gaming en http://localhost:3000');
});