// ─────────────────────────────────────────────────────────────
//  data.js — Base de personajes
//  Las imágenes se obtienen automáticamente desde Jikan API
//  (MyAnimeList) en tiempo real al hacer la consulta.
// ─────────────────────────────────────────────────────────────

const animeData = {

  saintseiya: [
    { id: 1,  name: 'Seiya',      age: '13',      power: 'Meteoro de Pegaso'    },
    { id: 2,  name: 'Shiryu',     age: '13',      power: 'Escudo de Rochi'      },
    { id: 3,  name: 'Hyoga',      age: '13',      power: 'Aurora Execution'     },
    { id: 4,  name: 'Shun',       age: '13',      power: 'Cadenas Nebulosas'    },
    { id: 5,  name: 'Ikki',       age: '14',      power: 'Fantasma de Fénix'    },
    { id: 6,  name: 'Aioria',     age: '20',      power: 'Plasma de Fotones'    },
    { id: 7,  name: 'Milo',       age: '20',      power: 'Escarlata Aguja'      },
    { id: 8,  name: 'Aldebaran',  age: '20',      power: 'Gran Cuerno'          },
    { id: 9,  name: 'Saga',       age: '28',      power: 'Galaxia Explosión'    },
    { id: 10, name: 'Shaka',      age: '20',      power: 'Om'                   },
  ],

  hunterxhunter: [
    { id: 1,  name: 'Gon',      age: '12',      power: 'Jajanken'              },
    { id: 2,  name: 'Killua',   age: '12',      power: 'Narukami'              },
    { id: 3,  name: 'Kurapika', age: '17',      power: 'Cadena Imperativa'     },
    { id: 4,  name: 'Leorio',   age: '19',      power: 'Proyección 3D'         },
    { id: 5,  name: 'Hisoka',   age: '28',      power: 'Bungee Gum'            },
    { id: 6,  name: 'Chrollo',  age: '26',      power: 'Robo de Habilidades'   },
    { id: 7,  name: 'Illumi',   age: '24',      power: 'Control de Agujas'     },
    { id: 8,  name: 'Meruem',   age: '40 días', power: 'Photon'                },
    { id: 9,  name: 'Netero',   age: '120',     power: '100 Tipo Guanyin'      },
    { id: 10, name: 'Zeno',     age: '67',      power: 'Lluvia de Dragones'    },
  ],

  onepiece: [
    { id: 1,  name: 'Luffy',   age: '19', power: 'Gomu Gomu no Mi'  },
    { id: 2,  name: 'Zoro',    age: '21', power: 'Santoryu'          },
    { id: 3,  name: 'Nami',    age: '20', power: 'Clima Tact'        },
    { id: 4,  name: 'Usopp',   age: '19', power: 'Kabuto'            },
    { id: 5,  name: 'Sanji',   age: '21', power: 'Diable Jambe'      },
    { id: 6,  name: 'Chopper', age: '17', power: 'Hito Hito no Mi'   },
    { id: 7,  name: 'Robin',   age: '30', power: 'Hana Hana no Mi'   },
    { id: 8,  name: 'Franky',  age: '36', power: 'Cuerpo Cyborg'     },
    { id: 9,  name: 'Brook',   age: '90', power: 'Yomi Yomi no Mi'   },
    { id: 10, name: 'Shanks',  age: '39', power: 'Haki del Rey'      },
  ],

  naruto: [
    { id: 1,  name: 'Naruto',   age: '17', power: 'Rasengan / Modo Sabio'    },
    { id: 2,  name: 'Sasuke',   age: '17', power: 'Chidori / Mangekyou'      },
    { id: 3,  name: 'Sakura',   age: '17', power: 'Fuerza Sobrehumana'       },
    { id: 4,  name: 'Kakashi',  age: '29', power: 'Sharingan Copiador'       },
    { id: 5,  name: 'Rock Lee', age: '17', power: 'Apertura de Compuertas'   },
    { id: 6,  name: 'Gaara',    age: '17', power: 'Arena Shinobi'            },
    { id: 7,  name: 'Jiraiya',  age: '54', power: 'Modo Sabio de la Rana'    },
    { id: 8,  name: 'Tsunade',  age: '51', power: 'Fuerza de Cien Sellos'    },
    { id: 9,  name: 'Itachi',   age: '21', power: 'Amaterasu / Tsukuyomi'    },
    { id: 10, name: 'Minato',   age: '24', power: 'Rasengan / Paso Volador'  },
  ],
};

module.exports = animeData;
