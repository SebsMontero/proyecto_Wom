const router = require('express').Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/form', isNotLoggedIn, (req, res, next) => {
  try {
    res.render("auth/form");
  } catch (error) {
    res.render('404');
  }
});

router.post('/form', isNotLoggedIn, async (req, res) => {
  try {
    const { tipo_documento, documento, nombres, apellidos, telefono, correo, cursos_disponibles } = req.body;
    console.log(req.body);
    const consulta = "SELECT * FROM tbl_rformulario_cursos WHERE FOR_CTIPO_DOCUMENTO = '" + tipo_documento + "' AND FOR_CCORREO_ELECTRONICO = '" + correo + "';"
    console.log(consulta);
    const result = await pool.query(consulta);
    console.log(result)
    if (result.length > 0) {
      console.log('Ya registrado')
      messagge = 'Ya te encuentras registrado en el curso de: ' + result[0].FOR_CCURSO_INTERES
      req.flash('message', messagge);
      res.redirect('/form');
    } else {
      console.log('Registrando')
      const newUser = {
        FOR_CTIPO_DOCUMENTO: tipo_documento,
        FOR_CNUMERO_DOCUMENTO: documento,
        FOR_CNOMBRES: nombres,
        FOR_CAPELLIDOS: apellidos,
        FOR_CTELEFONO: telefono,
        FOR_CCORREO_ELECTRONICO: correo,
        FOR_CCURSO_INTERES: cursos_disponibles,
      };
      await pool.query('INSERT INTO tbl_rformulario_cursos set ?', [newUser]);
      req.flash('success', 'Registrado Correctamente!');
      res.redirect('/form');
    }
  } catch {
    req.flash('message', 'Ups! hubo un error en el registro');
    res.redirect('/form');
  }
})

// ---------------------------------


/* Estudiantes */
router.get('/adminestudiantes', isLoggedIn, async (req, res) => {
  try {
    const gestor_asiganado = req.user.USU_CUSUARIO;
    if (req.user.USU_CROL == "Administrador") {
      const users = await pool.query('SELECT * FROM tbl_rformulario_cursos');
      res.render('crud/adminestudiantes', { users });
    } else if (req.user.USU_CROL == "Gestor") {
      const sql = "SELECT * FROM tbl_rformulario_cursos WHERE FOR_CGESTOR_ASIGNADO = '" + gestor_asiganado + "';"
      console.log(sql);
      const users = await pool.query(sql);
      res.render('crud/adminestudiantes', { users });
    } else {
      res.redirect('/redirect');
    }
  } catch (error) {
    res.render('401');
  }
});

/* Modificar Estudiantes */
router.post('/adminestudiantes/:id', isLoggedIn, async (req, res) => {
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
});


/* Consultas */
router.post('/consultacursos', async (req, res) => {
  try {    
      const sql = "SELECT * FROM tbl_rcursos_disponibles WHERE CUR_CESTADO = 'Activo';"
      // console.log(sql);
      const consulta = await pool.query(sql);
      // console.log(consulta)
      res.json(consulta)
  } catch (error) {
    console.log('Error')
  }
});

router.post('/consultaGestores',  async (req, res) => {
  try {
      const sql = "SELECT * FROM tbl_rusuarios WHERE USU_CROL = 'Gestor' AND USU_CESTADO = 'Activo';"
      // console.log(sql);
      const consulta = await pool.query(sql);
      res.json(consulta)
  } catch (error) {
    console.log('Error')
  }
});

module.exports = router;