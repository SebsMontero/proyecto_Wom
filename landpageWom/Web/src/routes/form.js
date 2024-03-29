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
    const { casott, causal, segmento, regional, tipo_transaccion, transaccion, asesor, canal_ventas, telefono_asesor, codigo} = req.body;
    console.log(req.body);
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
      FOR_CNUMERO_CREADOR: telefono_asesor,
      FOR_CCODIGO_CREADOR: codigo
    };
    const sqlCaso = `SELECT * FROM tbl_rformulario_escalamiento WHERE FOR_CCASO_TT = ?`;
    const[rows] = await pool.query(sqlCaso, casott);

    if(rows > 0){
      //Ya existe el caso
      const sql = `INSERT INTO tbl_rformulario_escalamiento set ?`;
      await pool.query(sql, [newCase]);
      const newForm = {
        CON_CCASUAL_ESCALAMIENTO: causal,
        CON_CNOMBRE_CREADOR: asesor,
        CON_CCANAL_VENTAS_CREADOR: canal_ventas,
        CON_CNUMERO_CREADOR: telefono_asesor
      };
      const sqlConsolidado = `UPDATE tbl_rconsolidado set ? WHERE CON_CCASO_TT = ?`;
      await pool.query(sqlConsolidado, [newForm]);
      req.flash('success', 'Registrado Correctamente!');
      res.redirect('/form');
    } else{
      //Nuevo caso
      const sql = `INSERT INTO tbl_rformulario_escalamiento set ?`;
      await pool.query(sql, [newCase]);
      const newForm = {
        CON_CCASO_TT: casott,
        CON_CCASUAL_ESCALAMIENTO: causal,
        CON_CSEGMENTO: segmento,
        CON_CREGIONAL: regional,
        CON_CTIPO_TRANSACCION: tipo_transaccion,
        CON_CTRANSACCION: transaccion,
        CON_CNOMBRE_CREADOR: asesor,
        CON_CCANAL_VENTAS_CREADOR: canal_ventas,
        CON_CNUMERO_CREADOR: telefono_asesor
      };
      const sqlConsolidado = `INSERT INTO tbl_rconsolidado set ?`;
      await pool.query(sqlConsolidado, [newForm]);
      req.flash('success', 'Registrado Correctamente!');
      res.redirect('/form');
    }
  } catch {
    req.flash('message', '¡Ups! hubo un error en el registro del caso');
    res.redirect('/form');
  }
})

// ---------------------------------


/* Casos TT */
router.get('/admincasos', isLoggedIn, async (req, res) => {
  try {
    const sql = `SELECT * FROM tbl_rformulario_escalamiento`;
    const casos = await pool.query(sql);
    res.render('crud/admincasos', { casos });
    console.log("ENTRO");
  } catch (error) {
    console.log("CATCH");
    res.render('401');
  }
});

router.post('/consultacasos', async (req, res) => {
  try {    
      const sql = "SELECT * FROM tbl_rformulario_escalamiento;"
      // console.log(sql);
      const consulta = await pool.query(sql);
      // console.log(consulta)
      res.json(consulta)
  } catch (error) {
    console.log('Error')
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