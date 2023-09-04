const router = require('express').Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { database } = require('../keys');
const DB = database.database;

router.get('/form', isNotLoggedIn, (req, res, next) => {
  try {
    res.render("auth/form");
  } catch (error) {
    res.render('404');
  }
});

router.post('/form', isNotLoggedIn, async (req, res) => {
  try {
    const { casott, causal, segmento, regional, tipo_transaccion, transaccion, asesor, canal_ventas, telefono_asesor} = req.body;
    console.log(req.body);
    /* const consulta = "SELECT * FROM ${DB}.tbl_rformulario_cursos WHERE FOR_CCASO_TT = '" + tipo_documento + "';"
    console.log(consulta);
    const result = await pool.query(consulta);
    console.log(result)
    if (result.length > 0) {
      console.log('Ya registrado')
      messagge = 'Ya te encuentras registrado en el curso de: ' + result[0].FOR_CCURSO_INTERES
      req.flash('message', messagge);
      res.redirect('/form');
    } else { */
    console.log('Registrando')
    const newCase = {
      FOR_CCASO_TT: casott,
      FOR_CCASUAL_ESCALAMIENTO: causal,
      FOR_CSEGMENTO: segmento,
      FOR_CREGIONAL: regional,
      FOR_CTIPO_TRANSACCION: tipo_transaccion,
      FOR_CTRANSACCION: transaccion,
      FOR_CNOMBRE_CREADOR: asesor,
      FOR_CCANAL_VENTAS_CREADOR: canal_ventas,
      FOR_CNUMERO_CREADOR: telefono_asesor
    };
    const sql = `INSERT INTO ${DB}.tbl_rformulario_escalamiento set ?`;
    await pool.query(sql, [newCase]);
    req.flash('success', 'Registrado Correctamente!');
    res.redirect('/form');
    
  } catch {
    req.flash('message', 'Ups! hubo un error en el registro del caso');
    res.redirect('/form');
  }
})

// ---------------------------------


/* Casos TT */
router.get('/admincasos', isLoggedIn, async (req, res) => {
  try {
    const sql = `SELECT * FROM ${DB}.tbl_rformulario_escalamiento`;
    const users = await pool.query(sql);
    res.render('crud/admincasos', { users });
  } catch (error) {
    res.render('401');
  }
});

/* Modificar Estudiantes */
/* router.post('/adminestudiantes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { gestor, observaciones, estado_estudiante } = req.body;
  console.log(req.body.gestor);
  const newMensaje = {
    FOR_CGESTOR_ASIGNADO: gestor,
    FOR_COBSERVACIONES: observaciones,
    FOR_CESTADO: estado_estudiante,
  };
  await pool.query('UPDATE tbl_rformulario_cursos set ? WHERE PKFOR_NCODIGO = ?', [newMensaje, [id]]);
  req.flash('success', 'Estudiante Actualizado Correctamente!!!');
  res.redirect('/adminestudiantes');
}); */


/* Consultas */
/* router.post('/consultacursos', async (req, res) => {
  try {    
      const sql = "SELECT * FROM tbl_rcursos_disponibles WHERE CUR_CESTADO = 'Activo';"
      // console.log(sql);
      const consulta = await pool.query(sql);
      // console.log(consulta)
      res.json(consulta)
  } catch (error) {
    console.log('Error')
  }
}); */

/* router.post('/consultaGestores',  async (req, res) => {
  try {
      const sql = "SELECT * FROM tbl_rusuarios WHERE USU_CROL = 'Gestor' AND USU_CESTADO = 'Activo';"
      // console.log(sql);
      const consulta = await pool.query(sql);
      res.json(consulta)
  } catch (error) {
    console.log('Error')
  }
}); */

module.exports = router;