// ─────────────────────────────────────────────────────────────
//  data.js
//  malId = ID exacto del personaje en MyAnimeList
//  Jikan usa ese ID para ir directo al personaje correcto
// ─────────────────────────────────────────────────────────────

const animeData = {

  saintseiya: [
    { id: 1,  name: 'Seiya',      age: '13',      power: 'Meteoro de Pegaso',    malId: 1733  },
    { id: 2,  name: 'Shiryu',     age: '13',      power: 'Escudo de Rochi',      malId: 1737  },
    { id: 3,  name: 'Hyoga',      age: '13',      power: 'Aurora Execution',     malId: 1735  },
    { id: 4,  name: 'Shun',       age: '13',      power: 'Cadenas Nebulosas',    malId: 1736  },
    { id: 5,  name: 'Ikki',       age: '14',      power: 'Fantasma de Fénix',    malId: 1734  },
    { id: 6,  name: 'Aioria',     age: '20',      power: 'Plasma de Fotones',    malId: 1741  },
    { id: 7,  name: 'Milo',       age: '20',      power: 'Escarlata Aguja',      malId: 1745  },
    { id: 8,  name: 'Aldebaran',  age: '20',      power: 'Gran Cuerno',          malId: 1740  },
    { id: 9,  name: 'Saga',       age: '28',      power: 'Galaxia Explosión',    malId: 1743  },
    { id: 10, name: 'Shaka',      age: '20',      power: 'Om',                   malId: 1748  },
  ],

  hunterxhunter: [
    { id: 1,  name: 'Gon',      age: '12',      power: 'Jajanken',             malId: 30    },
    { id: 2,  name: 'Killua',   age: '12',      power: 'Narukami',             malId: 31    },
    { id: 3,  name: 'Kurapika', age: '17',      power: 'Cadena Imperativa',    malId: 32    },
    { id: 4,  name: 'Leorio',   age: '19',      power: 'Proyección 3D',        malId: 33    },
    { id: 5,  name: 'Hisoka',   age: '28',      power: 'Bungee Gum',           malId: 3     },
    { id: 6,  name: 'Chrollo',  age: '26',      power: 'Robo de Habilidades',  malId: 1438  },
    { id: 7,  name: 'Illumi',   age: '24',      power: 'Control de Agujas',    malId: 1440  },
    { id: 8,  name: 'Meruem',   age: '40 días', power: 'Photon',               malId: 64067 },
    { id: 9,  name: 'Netero',   age: '120',     power: '100 Tipo Guanyin',     malId: 1439  },
    { id: 10, name: 'Zeno',     age: '67',      power: 'Lluvia de Dragones',   malId: 33605 },
  ],

  onepiece: [
    { id: 1,  name: 'Luffy',   age: '19', power: 'Gomu Gomu no Mi',  malId: 40    },
    { id: 2,  name: 'Zoro',    age: '21', power: 'Santoryu',          malId: 60    },
    { id: 3,  name: 'Nami',    age: '20', power: 'Clima Tact',        malId: 723   },
    { id: 4,  name: 'Usopp',   age: '19', power: 'Kabuto',            malId: 724   },
    { id: 5,  name: 'Sanji',   age: '21', power: 'Diable Jambe',      malId: 305   },
    { id: 6,  name: 'Chopper', age: '17', power: 'Hito Hito no Mi',   malId: 309   },
    { id: 7,  name: 'Robin',   age: '30', power: 'Hana Hana no Mi',   malId: 311   },
    { id: 8,  name: 'Franky',  age: '36', power: 'Cuerpo Cyborg',     malId: 314   },
    { id: 9,  name: 'Brook',   age: '90', power: 'Yomi Yomi no Mi',   malId: 318   },
    { id: 10, name: 'Shanks',  age: '39', power: 'Haki del Rey',      malId: 306   },
  ],

  naruto: [
    { id: 1,  name: 'Naruto',   age: '17', power: 'Rasengan / Modo Sabio',    malId: 17   },
    { id: 2,  name: 'Sasuke',   age: '17', power: 'Chidori / Mangekyou',      malId: 13   },
    { id: 3,  name: 'Sakura',   age: '17', power: 'Fuerza Sobrehumana',       malId: 14   },
    { id: 4,  name: 'Kakashi',  age: '29', power: 'Sharingan Copiador',       malId: 85   },
    { id: 5,  name: 'Rock Lee', age: '17', power: 'Apertura de Compuertas',   malId: 522  },
    { id: 6,  name: 'Gaara',    age: '17', power: 'Arena Shinobi',            malId: 82   },
    { id: 7,  name: 'Jiraiya',  age: '54', power: 'Modo Sabio de la Rana',    malId: 83   },
    { id: 8,  name: 'Tsunade',  age: '51', power: 'Fuerza de Cien Sellos',    malId: 84   },
    { id: 9,  name: 'Itachi',   age: '21', power: 'Amaterasu / Tsukuyomi',    malId: 80   },
    { id: 10, name: 'Minato',   age: '24', power: 'Rasengan / Paso Volador',  malId: 1532 },
  ],
};

module.exports = animeData;
