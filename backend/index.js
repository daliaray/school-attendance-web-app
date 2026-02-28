const mysql = require('mysql');
const express =require('express');
var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
var cors = require('cors') 
app.use(cors())
const jwt = require('jsonwebtoken');
app.use(express.json())
require('dotenv').config()
const { format } = require('date-fns'); 





var mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'proj',
    multipleStatements : true
});

mysqlConnection.connect((err)=>{ 
    if (!err)
        console.log('DB connection succeeded.');
    else
        console.log('DB connection failed \n Error : '+JSON.stringify(err, undefined, 2));
});
app.listen(3000,()=>console.log('Express server is running at port no : 3000'));






app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  mysqlConnection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, rows, fields) => {
    if (!err) {
      if (rows.length > 0) {
        const user = {
          email: rows[0].email,
          password: rows[0].password,
          username: rows[0].username,
          role: rows[0].role,// Include the role in the user object
          id: rows[0].id,  
        };
        if (user.role === 'parentuser') {
          // Store the user's ID in the dataStore object
          dataStore.userId = user.id;
        }
        if (user.role === 'teacheruser') {
          // Store the user's ID in the dataStore object
          dataStore.userTId = user.id;
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        res.send({ token: accessToken, userId: rows[0].id, username: rows[0].username, role: rows[0].role });
      } else {
        res.status(401).send('Invalid email or password');
      }
    } else {
      console.log(err);
      res.status(500).send('Server error');
    }
  });
});

  
function authenticateFunction(req, res, next){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

//jiht teacher


//add teacher and add user

app.post('/teacher', (req, res) => {
  let tuple = req.body;
  let username = tuple.lastname + tuple.firstname; // Calculate username here

  var sqlTeacher = "INSERT INTO teacher (lastname, firstname, password, email, subject, contact, adresse) VALUES (?, ?, ?, ?, ?, ?, ?)";
  var sqlUser = "INSERT INTO user (id, password, email, username, role) VALUES (?, ?, ?, ?, 'teacheruser')";

  // Execute the first query to insert teacher data
  mysqlConnection.query(sqlTeacher, [tuple.lastname, tuple.firstname, tuple.password, tuple.email, tuple.subject, tuple.contact, tuple.adresse], (teacherErr, teacherRows, teacherFields) => {
    if (!teacherErr) {
      const teacherID = teacherRows.insertId; // Get the inserted teacher's ID
      
      // Execute the second query to insert user data
      mysqlConnection.query(sqlUser, [teacherID, tuple.password, tuple.email, username], (userErr, userRows, userFields) => {
        if (!userErr) {
          res.json({ message: 'inserted' });
        } else {
          console.log(userErr);
          res.status(500).send('Error occurred while inserting into user table');
        }
      });
    } else {
      console.log(teacherErr);
      res.status(500).send('Error occurred while inserting into teacher table');
    }
  });
});




 
//jib teachers
app.get('/teacher/',(req,res)=>{
  mysqlConnection.query('SELECT * FROM teacher ',[req.params.user],(err, rows, fields)=>{
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
});

app.get('/subject/', (req, res) => {
  const teacher_id = req.params.teacher_id;
  
  console.log('Received request for teacher_id:', teacher_id);
  const userTId = dataStore.userTId;
  mysqlConnection.query('SELECT subject FROM teacher WHERE teacher_id = ?', [userTId], (err, rows, fields) => {
    if (!err) {
      const subjects = rows.map(row => row.subject); // Extract subjects from rows
      console.log('Fetched subject data:', subjects);
      res.send(subjects);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching subject data' });
    }
  });
});


//update teacher
app.put('/teacher/:id', (req, res) => {
  let tuple = req.body;
  var sql = "UPDATE teacher SET lastname=?, firstname=?, password=?, email=?, subject=?, contact=?, adresse=? WHERE teacher_id=?;";
  mysqlConnection.query(sql, [tuple.lastname, tuple.firstname, tuple.password, tuple.email, tuple.subject, tuple.contact, tuple.adresse, req.params.id], (err, rows, fields) => {
    if (!err){
    res.json({ message: 'updated' });}
    else{
      console.log(err);}
  });
});

//delete teacher
app.delete('/teacher/:id', (req, res) => {
  mysqlConnection.query('DELETE FROM teacher WHERE teacher_id = ?', [req.params.id], (err, rows, fields) => {
    if (!err) {
      res.json({ message: 'Teacher deleted successfully' }); // Sending a JSON response with a success message
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while deleting the teacher' }); // Sending an error response
    }
  });
});


//jiht student
// Create an in-memory object to store the 'idelev' value

//PAS UTILISE
app.get('/idelev', (req, res) => {
  // Retrieve the 'idelev' value from the dataStore object
  const idelev = dataStore.idelev;

  // Check if the 'idelev' value is set or not
  if (!idelev) {
    res.status(404).json({ message: 'idelev value not set.' });
  } else {
    // Send back the 'idelev' value in the response
    res.json({ message: `Received idelev: ${idelev}` });
  }
});



//add student and add user
app.post('/student', (req, res) => {
  let tuple = req.body;

  // Concatenate lastname and firstname
  let username = tuple.lastname + tuple.firstname;

  // Start a MySQL transaction
  mysqlConnection.beginTransaction((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error starting the transaction');
    }

    var sql = "INSERT INTO student (id_parent, lastname, firstname, id_empreinte, password, email, contact, class, sem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var userSql = "INSERT INTO user (id, password, email, username, role) VALUES (?, ?, ?, ?, 'studentuser')";

    // Insert data into the student table
    mysqlConnection.query(sql, [tuple.id_parent, tuple.lastname, tuple.firstname, tuple.id_empreinte, tuple.password, tuple.email, tuple.contact, tuple.class, tuple.sem], (err, studentResult) => {
      if (err) {
        console.log(err);
        // Rollback the transaction in case of an error
        mysqlConnection.rollback(() => {
          res.status(500).send('Error occurred while inserting into student table');
        });
      } else {
        // Get the last insert ID (student ID)
        const studentId = studentResult.insertId;

        // Insert data into the user table with the same student ID
        mysqlConnection.query(userSql, [studentId, tuple.password, tuple.email, username], (userErr, userResult) => {
          if (userErr) {
            console.log(userErr);
            // Rollback the transaction in case of an error
            mysqlConnection.rollback(() => {
              res.status(500).send('Error occurred while inserting into user table');
            });
          } else {
            // Commit the transaction if both inserts are successful
            mysqlConnection.commit((commitErr) => {
              if (commitErr) {
                console.log(commitErr);
                // Rollback the transaction in case of a commit error
                mysqlConnection.rollback(() => {
                  res.status(500).send('Error occurred during transaction commit');
                });
              } else {
                res.json({ message: 'inserted' });
              }
            });
          }
        });
      }
    });
  });
});


 
//jib students
app.get('/student/',(req,res)=>{
  mysqlConnection.query('SELECT * FROM student ',[req.params],(err, rows, fields)=>{
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
});

app.get('/student/:lastname/:firstname', (req, res) => {
  const lastname = req.params.lastname;
  const firstname = req.params.firstname;

  mysqlConnection.query('SELECT * FROM student WHERE lastname=? AND firstname=?', [lastname, firstname], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching student data' });
    }
  });
});

app.get('/student/:class', (req, res) => {
  const className = req.params.class;

  mysqlConnection.query('SELECT student_id, lastname, firstname FROM student WHERE class = ?', [className], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching student data' });
    }
  });
});

app.get('/student1/', (req, res) => {
  const id_parent = req.params.id_parent;
  console.log('Received request for id_parent:', id_parent);
  const userId = dataStore.userId;
  mysqlConnection.query('SELECT lastname, firstname FROM student WHERE id_parent = ?', [userId], (err, rows, fields) => {
    if (!err) {
      console.log('Fetched student data:', rows);
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching student data' });
    }
  });
});










//update student
app.put('/student/:id', (req, res) => {
  let tuple = req.body;

  // Concatenate lastname and firstname to create the username
  let username = tuple.lastname + tuple.firstname;

  var sql = "UPDATE student SET `id_parent`=?, `lastname`=?, `firstname`=?, `id_empreinte`=?, `password`=?, `email`=?, `contact`=?, `class`=?, `sem`=? WHERE `student_id`=?;";
  mysqlConnection.query(sql, [tuple.id_parent, tuple.lastname, tuple.firstname, tuple.id_empreinte, tuple.password, tuple.email, tuple.contact, tuple.class, tuple.sem, req.params.id], (err, rows, fields) => {
    if (!err) {
      // Update the user table when email, username, or password is changed
      var userSql = "UPDATE user SET `password`=?, `email`=?, `username`=? WHERE `email`=?;";
      mysqlConnection.query(userSql, [tuple.password, tuple.email, username, tuple.email], (userErr, userRows, userFields) => {
        if (!userErr) {
          res.json({ message: 'Student and User updated' });
        } else {
          console.log(userErr);
          res.status(500).json({ error: 'An error occurred while updating user' });
        }
      });
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while updating student' });
    }
  });
});

//update fingerpriint
app.put('/fingerprint/', (req, res) => {
  // Retrieve the 'idelev' value from the dataStore object
  const idelev = dataStore.idelev;

  // Assuming 'idelev' is defined or obtained from the request.
  // If 'idelev' is not available from the request, you should handle that case accordingly.

  // Assuming the 'id_empreinte' is sent in the request body.
  const id_empreinte = req.body.id_empreinte;

  // Make sure to use parameterized queries to prevent SQL injection.
  const sql = "UPDATE student SET `id_empreinte` = ? WHERE `student_id` = ?";

  mysqlConnection.query(sql, [id_empreinte, idelev], (err, rows, fields) => {
    if (!err) {
      mysqlConnection.commit((commitErr) => {
        if (commitErr) {
          console.error(commitErr);
        } else {
          console.log('Transaction committed.');
        }
      });
      res.json({ message: 'Student id_empreinte updated' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating id_empreinte' });
    }
  });
  
});

const dataStore = {};

app.get('/idelev/:id', (req, res) => {
  const idelev = req.params.id;
  // Store the 'idelev' value in the dataStore object
  dataStore.idelev = idelev;
  
  // Perform any operations you want with the 'idelev' value here.
  // For example, you can process the 'idelev' value and send a response.
  res.send(`Received idelev: ${idelev}`);
});
//attendance fingerprint
app.post('/attendance1', (req, res) => {
  let empreinte = req.body.id_empreinte;
console.log(empreinte);
  const sql = `
    INSERT INTO attendancesch (student_id, date, student, status)
    SELECT student_id, NOW(), CONCAT(lastname, ' ', firstname), 'present'
    FROM student
    WHERE id_empreinte=?
  `;

  mysqlConnection.query(sql, [empreinte], (err, result) => {
    if (err) {-
      console.log('Error inserting attendance:', err);
      return res.status(500).json({ message: 'Error occurred while inserting attendance', error: err });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    } else {
      res.json({ message: 'Attendance submitted successfully', result: result });
    }
  });
});

app.post('/attendance2', (req, res) => {
  let empreinte = req.body.id_empreinte;
  console.log(empreinte);

  const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  // Step 1: Mark all students in the `student` table as 'absent' in the `attendancesch` table for the current date
  const markAllStudentsAbsentSQL = `
  INSERT INTO attendancesch (student_id, date, student, status)
  SELECT student_id, '${currentDate}', CONCAT(lastname, ' ', firstname), 'absent'
  FROM student
`;


  mysqlConnection.query(markAllStudentsAbsentSQL, (absentErr, absentResult) => {
    if (absentErr) {
      console.log('Error marking all students absent:', absentErr);
      return res.status(500).json({ message: 'Error occurred while marking all students absent', error: absentErr });
    }

    // Step 2: Check if a fingerprint is provided and mark the student as 'present' if found
    if (empreinte) {
      const markPresentSQL = `
        UPDATE attendancesch AS a
        JOIN student AS s ON a.student_id = s.student_id
        SET a.status = 'present'
        WHERE s.id_empreinte = ?
        AND DATE(a.date) = CURDATE()
      `;

      mysqlConnection.query(markPresentSQL, [empreinte], (presentErr, presentResult) => {
        if (presentErr) {
          console.log('Error marking student present:', presentErr);
          return res.status(500).json({ message: 'Error occurred while marking student present', error: presentErr });
        }

        if (presentResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found or attendance already marked' });
        } else {
          res.json({ message: 'Attendance updated successfully', result: presentResult });
        }
      });
    } else {
      res.json({ message: 'All students marked as absent for the current date in the attendancesch table' });
    }
  });
});




//delete student
app.delete('/student/:id', (req, res) => {
  mysqlConnection.query('DELETE FROM student WHERE student_id = ?', [req.params.id], (err, rows, fields) => {
    if (!err) {
      res.json({ message: 'Student deleted successfully' }); // Sending a JSON response with a success message
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while deleting the student' }); // Sending an error response
    }
  });
});
//jiht classe
app.post('/class',(req,res)=>{
  let tuple=req.body;
  
  var sql="INSERT INTO class (classname) values(?)";
 
  mysqlConnection.query(sql,[tuple.classname] ,(err,rows,fields)=>{
    
      if (!err)
          res.json({message:'inserted'});
      else
          console.log(err);
  })

});

app.get('/class/',(req,res)=>{
  mysqlConnection.query('SELECT * FROM class ',[req.params],(err, rows, fields)=>{
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
});

app.post('/submitattendance', (req, res) => {
  const { student_id, date, student, classe, subject, status } = req.body;

  if (!student_id || !date || !student ||!classe || !subject || !status) {
    return res.status(400).json({ message: 'Invalid request. Missing date, student,subject,class or status.' });
  }

  const sql = 'INSERT INTO attendance (student_id, date, student, classe, subject, status) VALUES (?, ?, ?, ?, ?, ?)';

  mysqlConnection.query(sql, [student_id, date, student, classe, subject, status], (err, result) => {
    if (err) {
      console.log('Error inserting attendance:', err);
      return res.status(500).json({ message: 'Error occurred while inserting attendance', error: err });
    } else {
      res.json({ message: 'Attendance submitted successfully', result: result });
    }
  });
});

// Your Express.js API code

app.get('/attendancebyclass/:classe', (req, res) => {
  const classe = req.params.classe; // Get the class name from the request URL parameter
  const query = 'SELECT student_id, date, student, subject, status FROM attendance WHERE classe = ?';

  mysqlConnection.query(query, [classe], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching attendance data' });
    }
  });
});

app.get('/attendancebystudent/:student', (req, res) => {
  const student = req.params.student; // Get the class name from the request URL parameter
  const query = 'SELECT student_id, date, subject, classe, status FROM attendance WHERE student = ?';

  mysqlConnection.query(query, [student], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while fetching attendance data' });
    }
  });
});

//parent
app.post('/parent', (req, res) => {
  let tuple = req.body;
  let username = tuple.lastname + tuple.firstname; // Calculate username here

  var sqlParent = "INSERT INTO parent (lastname, firstname, email, password) VALUES (?, ?, ?, ?)";
  var sqlUser = "INSERT INTO user (id, password, email, username, role) VALUES (?, ?, ?, ?, 'parentuser')";

  // Execute the first query to insert parent data
  mysqlConnection.query(sqlParent, [tuple.lastname, tuple.firstname, tuple.email, tuple.password], (parentErr, parentRows, parentFields) => {
    if (!parentErr) {
      const parentID = parentRows.insertId; // Get the inserted parent's ID
      
      // Execute the second query to insert user data
      mysqlConnection.query(sqlUser, [parentID, tuple.password, tuple.email, username], (userErr, userRows, userFields) => {
        if (!userErr) {
          res.json({ message: 'inserted' });
        } else {
          console.log(userErr);
          res.status(500).send('Error occurred while inserting into user table');
        }
      });
    } else {
      console.log(parentErr);
      res.status(500).send('Error occurred while inserting into parent table');
    }
  });
});

app.get('/parent', (req, res) => {
  mysqlConnection.query('SELECT id, lastname, firstname FROM parent', (err, rows, fields) => {
    if (!err)
      res.send(rows);
    else
      console.log(err);
  });
});

app.get('/attendanceinsch/name', (req, res) => {
  const student = req.query.student;
  mysqlConnection.query('SELECT student_id,date,student,status FROM attendancesch where student=?', [student], (err, rows, fields) => {
    if (!err)
      res.send(rows);
    else
      console.log(err);
  });
});

app.get('/attendanceinsch', (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date in YYYY-MM-DD HH:MM:SS format as a string

  mysqlConnection.query(
    'SELECT student_id, date, student, status FROM attendancesch WHERE DATE(date) = DATE(?)',
    [currentDate],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error'); // You can handle the error response appropriately
      }
    }
  );
});




//count students exist 
app.get('/countStudents', (req, res) => {
  const countStudentsSQL = 'SELECT COUNT(*) AS studentCount FROM student';

  mysqlConnection.query(countStudentsSQL, (err, results) => {
    if (err) {
      console.error('Error counting students:', err);
      res.status(500).json({ error: 'Error occurred while counting students' });
    } else {
      const studentCount = results[0].studentCount;
      res.json({ totalStudents: studentCount });
    }
  });
});

app.get('/classcount', (req, res) => {
  const countClassSQL = 'SELECT COUNT(*) AS classCount FROM class';

  mysqlConnection.query(countClassSQL, (err, results) => {
    if (err) {
      console.error('Error counting classes:', err);
      res.status(500).json({ error: 'Error occurred while counting classes' });
    } else {
      const classCount = results[0].classCount;
      res.json({ totalClass: classCount });
    }
  });
});

app.get('/teachercount', (req, res) => {
  const countTeachersSQL = 'SELECT COUNT(*) AS teacherCount FROM teacher';

  mysqlConnection.query(countTeachersSQL, (err, results) => {
    if (err) {
      console.error('Error counting teachers:', err);
      res.status(500).json({ error: 'Error occurred while counting teachers' });
    } else {
      const teacherCount = results[0].teacherCount;
      res.json({ totalTeacher: teacherCount });
    }
  });
});


app.get('/teacher1', (req, res) => {
  mysqlConnection.query('SELECT lastname, firstname, subject FROM teacher', (err, rows, fields) => {
    if (!err)
      res.send(rows);
    else
      console.log(err);
  });
});
