const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const { database } = require('../keys');
const DB = database.database;


/* Usuario */
router.get('/adminusuarios', isLoggedIn, async (req, res) => {
    try {
        if (req.user.USU_CROL == "Administrador") {
            const sql = `SELECT * FROM ${DB}tbl_rusuarios`;
            const users = await pool.query(sql);
            res.render('crud/adminusuarios', {users});
        }  else {
            res.redirect('/redirect');
        } 
    } catch (error) {
        res.render('401');
    }
});

/* Registro Usuario */
router.post('/adminusuarios', isLoggedIn, async (req, res) => {
    const { documento, nombres_apellidos, usuario, password, rol, estado_usuario, responsable_gestion } = req.body;
    console.log(req.body);
    const newUser = {        
        USU_CDOCUMENTO: documento,
        USU_CNOMBRES_APELLIDOS: nombres_apellidos,
        USU_CUSUARIO: usuario,
        USU_CPASSWORD: password,
        USU_CROL: rol,
        USU_CESTADO: estado_usuario,
        USU_CRESPONSABLE_GESTION: responsable_gestion
    };
    newUser.USU_CPASSWORD = await helpers.encryptPassword(password);
    const sql = `INSERT INTO ${DB}.tbl_rusuarios set ?`;
    await pool.query(sql, [newUser]);
    req.flash('success', 'Usuario Registrado Correctamente!!!');
    res.redirect('/adminusuarios');
})


/* Modificar Usuario */
router.post('/adminusuarios/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { documento, nombres_apellidos, usuario, password, rol, estado_usuario} = req.body;
    console.log(req.body);
    const cargo = req.user.USU_CROL;
    const responsable_gestion = req.user.USU_CNOMBRES_APELLIDOS;
    const newUser = {        
        USU_CDOCUMENTO: documento,
        USU_CNOMBRES_APELLIDOS: nombres_apellidos,
        USU_CUSUARIO: usuario,
        USU_CPASSWORD: password,
        USU_CROL: rol,
        USU_CESTADO: estado_usuario,
        USU_CRESPONSABLE_GESTION: responsable_gestion
    };
    newUser.USU_CPASSWORD = await helpers.encryptPassword(password);
    const sql = `UPDATE tbl_rusuarios set ? WHERE PKUSU_NCODIGO = ?`;
    await pool.query(sql, [newUser,[id]]);
    req.flash('success', 'Usuario Actualizado Correctamente!!!');
    res.redirect('/adminusuarios');
});

// ---------------------------------


/* Cursos */
/* router.get('/admincursos', isLoggedIn, async (req, res) => {
    try {
        if (req.user.USU_CROL == "Administrador" || req.user.USU_CROL == "Supervisor") {
            const sql = `SELECT * FROM ${DB}.tbl_rcursos_disponibles`;
            const users = await pool.query(sql);
            res.render('crud/admincursos', {users});
        }  else {
            res.redirect('/redirect');
        } 
    } catch (error) {
        res.render('401');
    }
}); */

/* Registro Cursos */
/* router.post('/admincursos', isLoggedIn, async (req, res) => {
    const { cargo, responsable_gestion, nombre_curso, estado_curso } = req.body;
    console.log(req.body);
    const newUser = {        
        CUR_CNOMBRE_CURSO: nombre_curso,
        CUR_CESTADO: estado_curso,
        CUR_CCARGO: cargo,
        CUR_CRESPONSABLE_GESTION: responsable_gestion
    };
    console.log(newUser);
    await pool.query('INSERT INTO tbl_rcursos_disponibles set ?', [newUser]);
    req.flash('success', 'Curso Registrado Correctamente!!!');
    res.redirect('/admincursos');
}) */

/* Modificar Cursos */
/* router.post('/admincursos/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nombre_curso, estado_curso } = req.body;
    console.log(req.body);
    const cargo = req.user.USU_CROL;
    const responsable_gestion = req.user.USU_CUSUARIO;
    const newMensaje = {      
        CUR_CNOMBRE_CURSO: nombre_curso,
        CUR_CESTADO: estado_curso,
        CUR_CCARGO: cargo,
        CUR_CRESPONSABLE_GESTION: responsable_gestion
    };
    await pool.query('UPDATE tbl_rcursos_disponibles set ? WHERE PKCUR_NCODIGO = ?', [newMensaje,[id]]);
    req.flash('success', 'Curso Actualizado Correctamente!!!');
    res.redirect('/admincursos');
}); */

module.exports = router;